import {Component, ElementRef, Input} from "angular2/core"
import {LintService} from "../lint/LintService"
import {DebugService} from "../debug/DebugService";
import {HintService} from "../hint/HintService";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/fromEventPattern";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import {OnDestroy} from "angular2/core";
import {OutlineService} from "../outline/OutlineService";
import {ProofObligationsService} from "../proof-obligations/ProofObligationsService";
import {WorkspaceService} from "../files/WorkspaceService";
import {EditorService} from "./EditorService";
import {File} from "../files/File";
import {EditorPosition} from "./EditorPosition";
import {HostBinding} from "angular2/core";

declare var CodeMirror;

@Component({
    selector: 'editor',
    template: ''
})
export class EditorComponent {
    private codeMirror;
    private suspendedMarkings:Array = [];
    private highlightMarking;
    private file:File = null;

    @HostBinding('class.active') get active() { return !!this.file }

    changes$:Observable<string>;

    constructor(el:ElementRef,
                private lintService:LintService,
                private hintService:HintService,
                private debugService:DebugService,
                private editorService:EditorService) {

        this.editorService.currentFile$
            .subscribe(file => this.load(file));

        this.codeMirror = CodeMirror(el.nativeElement, {
            lineNumbers: true,
            styleActiveLine: true,
            lineWrapping: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            lint: {getAnnotations: (text, callback) => lintService.lint(this.file, callback), async: true},
            gutters: ["CodeMirror-linenumbers", "CodeMirror-breakpoints", "CodeMirror-lint-markers"]
        });

        // Editor changes
        this.changes$ = Observable.fromEventPattern(h => this.codeMirror.on("change", h), h => this.codeMirror.off("change", h))
            .map(cm => cm.getValue())
            .debounceTime(300)
            .distinctUntilChanged();

        this.changes$.subscribe(content => {
            this.file.save(content)
                .subscribe(() => this.editorService.onChange());
        });

        this.editorService.highlight$.subscribe(section => this.highlight(section));
        this.editorService.goto$.subscribe(position => this.goto(position.line, position.char));
        this.editorService.focus$.subscribe(line => this.focus(line));

        this.setupCodeCompletion();
        this.setupDebugging();
        this.setupResizing();
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
        // TODO: Doesn't seem to work with lines over 99
        var position = {line: line - 1};
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

        if (this.file !== null) {
            this.codeMirror.swapDoc(this.file.document);
            this.updateBreakpoints();
            this.updateStackFrames();
        }
    }

    private setupCodeCompletion() {
        var hint = (editor, callback) => this.hintService.hint(editor, callback, this.file);
        hint.async = true;

        CodeMirror.commands.autocomplete = cm => cm.showHint({hint: hint});
    }

    private updateStackFrames() {
        var stack = this.debugService.stackChanged.getValue();

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

    private updateBreakpoints() {
        this.codeMirror.clearGutter("CodeMirror-breakpoints");

        var breakpoints = this.debugService.breakpointsChanged.getValue();

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
        this.debugService.stackChanged.subscribe(frames => this.updateStackFrames());
        this.debugService.breakpointsChanged.subscribe(frames => this.updateBreakpoints());

        this.codeMirror.on("gutterClick", (cm, line) => {
            var info = cm.lineInfo(line);

            if (info.gutterMarkers && info.gutterMarkers['CodeMirror-breakpoints'])
                this.debugService.removeBreakpoint(this.file, line + 1);
            else
                this.debugService.setBreakpoint(this.file, line + 1);
        });
    }

    private setupResizing() {
        // TODO: Find better solution to detect if the editor is resized.
        var cm = this.codeMirror;
        var el = cm.getWrapperElement();
        var parent = el.parentNode;

        var lastHeight = -1;

        setInterval(() => {
            if (parent.clientHeight === lastHeight) return;

            lastHeight = parent.clientHeight;
            el.style.height = `${parent.clientHeight}px`;

            cm.refresh();
        }, 100);
    }
}