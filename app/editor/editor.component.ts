import {Component, ElementRef, Input} from "angular2/core"
import {LintService} from "../lint/LintService"
import {FilesService} from "../files/FilesService";
import {DebugService} from "../debug/DebugService";
import {HintService} from "../hint/HintService";

declare var CodeMirror;

@Component({
    selector: "editor",
    template: ''
})
export class EditorComponent {
    private codeMirror;
    private _file:string;
    private suspendedMarkings:Array = [];

    @Input() set file(file:string) {
        this._file = file;

        if (!file) return;

        this.filesService
            .readFile(file)
            .then(content => this.codeMirror.getDoc().setValue(content));
    }
    get file():string {
        return this._file;
    }

    constructor(
        el:ElementRef,
        lintService:LintService,
        private hintService: HintService,
        private debugService:DebugService,
        private filesService:FilesService)
    {
        this.codeMirror = CodeMirror(el.nativeElement, {
            lineNumbers: true,
            styleActiveLine: true,
            lineWrapping: true,
            extraKeys: { "Ctrl-Space": "autocomplete" },
            lint: { getAnnotations: (text, callback) => lintService.lint(this.file, callback), async: true },
            gutters: ["CodeMirror-linenumbers", "CodeMirror-breakpoints", "CodeMirror-lint-markers"]
        });

        this.setupCodeCompletion();
        this.setupDebugging();
    }

    private setupCodeCompletion() {
        var hint = (editor, callback) => this.hintService.hint(editor, callback, this.file);
        hint.async = true;

        CodeMirror.commands.autocomplete = cm => cm.showHint({ hint: hint });
    }

    private setupDebugging() {
        this.debugService.suspended.subscribe(lines => {
            this.suspendedMarkings.forEach(m => m.clear());

            if (lines.length === 0) return;

            this.suspendedMarkings = lines.map(
                (line, i) => this.codeMirror.markText(
                    {line: line-1, ch: 0},
                    {line: line-1, ch: 1000},
                    {className: i === 0 ? "CodeMirror-suspended" : "CodeMirror-frame"}
                ));
        });

        this.codeMirror.on("gutterClick", (cm, n) => {
            var info = cm.lineInfo(n);

            if (info.gutterMarkers && info.gutterMarkers['CodeMirror-breakpoints']) {
                this.debugService.removeBreakpoint(this.file, n + 1);
                cm.setGutterMarker(n, "CodeMirror-breakpoints", null);
            } else {
                var marker = document.createElement("div");
                marker.classList.add("CodeMirror-breakpoint");
                marker.innerHTML = "●";

                this.debugService.setBreakpoint(this.file, n + 1);
                cm.setGutterMarker(n, "CodeMirror-breakpoints", marker);
            }
        });
    }
}