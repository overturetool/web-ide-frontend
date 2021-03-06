import {Component, ElementRef, HostBinding} from "angular2/core"
import {LintService} from "../lint/LintService"
import {HintService} from "../hint/HintService";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/fromEventPattern";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import {EditorService} from "./EditorService";
import {File} from "../files/File";
import {Breakpoint} from "../debug/Breakpoint";
import {StackFrame} from "../debug/StackFrame";
import {Subscription} from "rxjs/Subscription";

declare var CodeMirror;

@Component({
    selector: 'editor',
    template: ``
})
export class EditorComponent {
    private codeMirror;
    private suspendedMarkings:Array<any> = [];
    private highlightMarking:any;
    private file:File = null;

    private modeSubscription:Subscription;
    private breakpointSubscription:Subscription;
    private stackSubscription:Subscription;

    @HostBinding('class.active')
    get active() {
        return !!this.file
    }

    changes$:Observable<string>;

    constructor(private el:ElementRef,
                private lintService:LintService,
                private hintService:HintService,
                private editorService:EditorService) {

        this.codeMirror = CodeMirror(this.el.nativeElement, {
            lineNumbers: true,
            styleActiveLine: true,
            lineWrapping: true,
            theme: "",
            matchBrackets: true,
            autoCloseBrackets: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            lint: {getAnnotations: (text, callback) => lintService.lint(this.file, callback), async: true},
            gutters: ["CodeMirror-linenumbers", "CodeMirror-breakpoints", "CodeMirror-lint-markers"]
        });

        // Editor changes
        Observable.fromEventPattern(h => this.codeMirror.on("change", h), h => this.codeMirror.off("change", h))
            .map((cm:any) => cm.getValue())
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe((content:string) => this.editorService.onChange(content));

        this.editorService.highlight$.subscribe(section => this.highlight(section));
        this.editorService.goto$.subscribe(position => this.goto(position.line, position.char));
        this.editorService.focus$.subscribe(line => this.focus(line));
        this.editorService.currentFile$.subscribe(file => this.load(file));

        this.setupDebugging();
        this.setupCodeCompletion();
    }

    highlight(section:EditorSection) {
        if (this.highlightMarking) this.highlightMarking.clear();

        if (!section) return;

        this.highlightMarking = this.codeMirror.markText(
            {line: section.startLine - 1, ch: section.startPos - 1},
            {line: section.endLine - 1, ch: section.endPos - 1},
            {className: "CodeMirror-highlight"}
        )
    }

    focus(line:number, char?:number) {
        var position = {line: line - 1, ch: undefined};
        if (char) position.ch = char - 1;

        this.codeMirror.scrollIntoView(position, 500);
        this.codeMirror.setCursor(position);
    }

    goto(line:number, char?:number) {
        this.focus(line, char);
        this.codeMirror.focus();
    }

    private load(file:File):void {
        if (this.file === null)
            setTimeout(() => this.codeMirror.refresh(), 0);

        this.file = file;

        if (this.file === null)  return;

        this.codeMirror.swapDoc(this.file.document);
        this.codeMirror.performLint();
        this.codeMirror.setOption("mode", this.file.mode.getValue());

        if (this.modeSubscription) this.modeSubscription.unsubscribe();
        this.file.mode.subscribe(mode => this.codeMirror.setOption("mode", mode));

        this.setupDebugListener();

        setTimeout(() => this.resize(), 0);
    }

    private setupCodeCompletion() {
        var hint:any = (editor, callback) => this.hintService.hint(editor, callback, this.file);
        hint.async = true;

        CodeMirror.commands.autocomplete = cm => cm.showHint({hint: hint});
    }

    private setupDebugListener() {
        var debug = this.editorService.currentProject$.getValue().debug;

        if (this.breakpointSubscription) this.breakpointSubscription.unsubscribe();
        if (this.stackSubscription) this.stackSubscription.unsubscribe();

        this.breakpointSubscription = debug.breakpoints$.subscribe(this.updateBreakpoints.bind(this));
        this.stackSubscription = debug.stack$.subscribe(this.updateStackFrames.bind(this));
    }

    private updateStackFrames(stack:Array<StackFrame>) {
        if (stack.length > 0) this.focus(stack[0].line);

        var breakedFrame = stack[0];
        var frames = stack.filter(frame => frame.file === this.file);

        this.suspendedMarkings.forEach(m => m.clear());

        if (frames.length === 0) return;

        this.focus(breakedFrame.line);

        this.suspendedMarkings = frames
            .map(frame => this.codeMirror.markText(
                {line: frame.line - 1, ch: frame.char - 1},
                {line: frame.line - 1, ch: 1000},
                {className: frame === breakedFrame ? "CodeMirror-suspended" : "CodeMirror-frame"}
            ));
    }

    private updateBreakpoints(breakpoints:Array<Breakpoint>) {
        this.codeMirror.clearGutter("CodeMirror-breakpoints");

        breakpoints
            .filter(bp => bp.file === this.file)
            .forEach(bp => {
                var marker = document.createElement("div");
                marker.classList.add("CodeMirror-breakpoint");
                marker.innerHTML = "●";

                this.codeMirror.setGutterMarker(bp.line - 1, "CodeMirror-breakpoints", marker);
            });
    }

    private setupDebugging() {
        this.codeMirror.on("gutterClick", (cm, line) => {
            var debug = this.editorService.currentProject$.getValue().debug;
            var info = cm.lineInfo(line);

            if (info.gutterMarkers && info.gutterMarkers['CodeMirror-breakpoints'])
                debug.removeBreakpoint(this.file, line + 1);
            else
                debug.setBreakpoint(this.file, line + 1);
        });
    }

    resize():void {
        this.codeMirror.getWrapperElement().style.height = `${this.el.nativeElement.clientHeight}px`;
        this.codeMirror.refresh();
    }
}