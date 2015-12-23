import {Component, ElementRef, Input} from "angular2/core"
import {LintService} from "../lint/LintService"
import {FilesService} from "../files/FilesService";
import {DebugService} from "../debug/DebugService";

declare var CodeMirror;

@Component({
    selector: "editor",
    template: ''
})
export class EditorComponent {
    private codeMirror;
    private _file:string;
    private suspendedMarking;

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

    suspend(line?:number) {
        if (this.suspendedMarking)
            this.suspendedMarking.clear();

        if (!line) return;

        this.suspendedMarking = this.codeMirror.markText(
            {line: line-1, ch: 0},
            {line: line-1, ch: 1000},
            {className: "CodeMirror-suspended"}
        );
    }

    constructor(el:ElementRef, lintService:LintService, debug:DebugService, public filesService:FilesService) {
        this.codeMirror = CodeMirror(el.nativeElement, {
            lineNumbers: true,
            styleActiveLine: true,
            lineWrapping: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            'lint': {'getAnnotations': (text, callback) => lintService.lint(this.file, callback), 'async': true},
            gutters: ["CodeMirror-linenumbers", "CodeMirror-breakpoints", "CodeMirror-lint-markers"]
        });

        CodeMirror.commands.autocomplete = function (cm) {
            cm.showHint({hint: CodeMirror.hint.vdm});
        };

        function makeMarker() {
            var marker = document.createElement("div");
            marker.classList.add("CodeMirror-breakpoint");
            marker.innerHTML = "●";
            return marker;
        }

        this.codeMirror.on("gutterClick", (cm, n) => {
            var info = cm.lineInfo(n);

            if (info.gutterMarkers && info.gutterMarkers['CodeMirror-breakpoints']) {
                debug.removeBreakpoint(this.file, n + 1);
                cm.setGutterMarker(n, "CodeMirror-breakpoints", null);
            } else {
                debug.setBreakpoint(this.file, n + 1);
                cm.setGutterMarker(n, "CodeMirror-breakpoints", makeMarker());
            }
        });
    }
}