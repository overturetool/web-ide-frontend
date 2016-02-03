import {Component, ElementRef, Input} from "angular2/core"
import {LintService} from "../lint/LintService"
import {FilesService} from "../files/FilesService";
import {DebugService} from "../debug/DebugService";
import {HintService} from "../hint/HintService";
import {Observable} from "rxjs/Observable";
import {OnDestroy} from "angular2/core";
import {OutlineService} from "../outline/OutlineService";

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

        // Get file content
        this.filesService.readFile(file).subscribe(this._setContent.bind(this));
    }
    get file() {
        return this._file;
    }

    constructor(el:ElementRef,
                lintService:LintService,
                private hintService:HintService,
                private outlineService:OutlineService,
                private debugService:DebugService,
                private filesService:FilesService) {

        this.codeMirror = CodeMirror(el.nativeElement, {
            lineNumbers: true,
            styleActiveLine: true,
            lineWrapping: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            lint: {getAnnotations: (text, callback) => lintService.lint(this.file, callback), async: true},
            gutters: ["CodeMirror-linenumbers", "CodeMirror-breakpoints", "CodeMirror-lint-markers"]
        });

        this.changes$ = Observable.fromEventPattern(h => this.codeMirror.on("change", h), h => this.codeMirror.off("change", h))
            .map(cm => cm.getValue())
            .debounceTime(300)
            .distinctUntilChanged();

        this.setupFileSystem();
        this.setupCodeCompletion();
        this.setupDebugging();
        this.setupOutline();
    }

    ngOnDestroy() {
        // Remove CodeMirror editor from DOM when component is destroyed.
        var element = this.codeMirror.getWrapperElement();
        element.parentNode.removeChild(element);
    }

    private setupFileSystem() {
        // Save file on changes
            this.changes$
                .subscribe(content => this.filesService.writeFile(this.file, content));
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
        this.codeMirror.scrollIntoView({line: line - 1, ch: 0});
    }

    private _setContent(content:string) {
        this.codeMirror.getDoc().setValue(content);
        this.codeMirror.clearHistory();
    }

    private setupCodeCompletion() {
        var hint = (editor, callback) => this.hintService.hint(editor, callback, this.file);
        hint.async = true;

        CodeMirror.commands.autocomplete = cm => cm.showHint({hint: hint});
    }

    private setupDebugging() {
        this.debugService.stackChanged
            .subscribe(frames => {
                this.suspendedMarkings.forEach(m => m.clear());

                if (frames.length === 0) return;

                this.suspendedMarkings = frames.map(
                    (frame, i) => this.codeMirror.markText(
                        {line: frame.$lineno - 1, ch: 0},
                        {line: frame.$lineno - 1, ch: 1000},
                        {className: i === 0 ? "CodeMirror-suspended" : "CodeMirror-frame"}
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
        // TODO: Fix this hack. Delay for fixing outline sometimes returning empty array.
        this.changes$.delay(300).subscribe(() => this.outlineService.update(this.file));

        this.outlineService.highlight$.subscribe(section => this.highlight(section));
        this.outlineService.focus$.subscribe(line => this.focus(line));
    }
}