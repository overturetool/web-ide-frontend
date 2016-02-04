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

declare var CodeMirror;

@Component({
    selector: 'editor',
    template: ''
})
export class EditorComponent implements OnDestroy {
    private codeMirror;
    private suspendedMarkings:Array = [];
    private highlightMarking;

    private _file;

    changes$:Observable<string>;

    @Input() set file(file) {
        this._file = file;
        this.init(file);
    }

    get file() {
        return this._file;
    }

    constructor(el:ElementRef,
                lintService:LintService,
                private hintService:HintService,
                private outlineService:OutlineService,
                private debugService:DebugService,
                private workspaceService:WorkspaceService,
                private proofObligationsService:ProofObligationsService) {

        this.codeMirror = CodeMirror(el.nativeElement, {
            lineNumbers: true,
            styleActiveLine: true,
            lineWrapping: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            lint: {getAnnotations: (text, callback) => lintService.lint(this.file, callback), async: true},
            gutters: ["CodeMirror-linenumbers", "CodeMirror-breakpoints", "CodeMirror-lint-markers"]
        });
    }

    private init(file:File) {
        file.read().subscribe(content => {
            this.codeMirror.getDoc().setValue(content);
            this.codeMirror.clearHistory();

            // Editor changes
            this.changes$ = Observable.fromEventPattern(h => this.codeMirror.on("change", h), h => this.codeMirror.off("change", h))
                .map(cm => cm.getValue())
                .debounceTime(300)
                .distinctUntilChanged();

            this.setupFileSystem();
            this.setupCodeCompletion();
            this.setupDebugging();
            this.setupOutline();
            this.setupProofObligations();
        });
    }

    ngOnDestroy() {
        // Remove CodeMirror editor from DOM when component is destroyed.
        var element = this.codeMirror.getWrapperElement();
        element.parentNode.removeChild(element);
    }

    private setupFileSystem() {
        this.changes$.subscribe(content => this.file.write(content));
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

    focus(line:number) {
        // TODO: Doesn't seem to work with lines over 99
        this.codeMirror.scrollIntoView({line: line - 1, ch: 0}, 500);
    }

    private setupCodeCompletion() {
        var hint = (editor, callback) => this.hintService.hint(editor, callback, this.file);
        hint.async = true;

        CodeMirror.commands.autocomplete = cm => cm.showHint({hint: hint});
    }

    private setupDebugging() {
        this.debugService.stackChanged
            .subscribe((allFrames:Array<StackFrame>) => {
                var breakedFrame = allFrames[0];
                var frames = allFrames.filter(frame => frame.$filename === this.file.path);

                this.suspendedMarkings.forEach(m => m.clear());

                if (frames.length === 0) return;

                this.focus(breakedFrame.$lineno);

                this.suspendedMarkings = frames
                    .map(frame => this.codeMirror.markText(
                        {line: frame.$lineno - 1, ch: 0},
                        {line: frame.$lineno - 1, ch: 1000},
                        {className: frame === breakedFrame ? "CodeMirror-suspended" : "CodeMirror-frame"}
                    ));
            });

        this.debugService.breakpointsChanged
            .subscribe(breakpoints => {
                this.codeMirror.clearGutter("CodeMirror-breakpoints");

                breakpoints
                    .filter(bp => bp.file === this.file)
                    .forEach(bp => {
                        var marker = document.createElement("div");
                        marker.classList.add("CodeMirror-breakpoint");
                        marker.innerHTML = "●";

                        this.codeMirror.setGutterMarker(bp.line - 1, "CodeMirror-breakpoints", marker);
                    });
            });

        this.codeMirror.on("gutterClick", (cm, line) => {
            var info = cm.lineInfo(line);

            if (info.gutterMarkers && info.gutterMarkers['CodeMirror-breakpoints'])
                this.debugService.removeBreakpoint(this.file, line + 1);
            else
                this.debugService.setBreakpoint(this.file, line + 1);
        });
    }

    private setupOutline() {
        this.changes$.subscribe(() => this.outlineService.update(this.file));

        this.outlineService.highlight$.subscribe(section => this.highlight(section));
        this.outlineService.focus$.subscribe(line => this.focus(line));
    }

    private setupProofObligations() {
        this.changes$.subscribe(() => this.proofObligationsService.update(this.file));

        this.proofObligationsService.highlight$.subscribe(section => this.highlight(section));
        this.proofObligationsService.focus$.subscribe(line => this.focus(line));
    }
}