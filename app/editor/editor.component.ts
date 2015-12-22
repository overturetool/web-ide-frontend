import {Component, ElementRef} from "angular2/core"
import {LintService} from "../lint/LintService"
import {ServerService} from "../server/ServerService"
import {FilesService} from "../files/FilesService";

declare var CodeMirror;

@Component({
    selector: "editor",
    template: ''
})
export class EditorComponent {
    private codeMirror;

    constructor(el:ElementRef, linter:LintService, server:ServerService, public files:FilesService) {
        this.codeMirror = CodeMirror(el.nativeElement, {
            lineNumbers: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            'lint': {'getAnnotations': (text, callback) => linter.lint(text, callback), 'async': true},
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
                server.emit('debug/remove-breakpoint', n + 1);
                cm.setGutterMarker(n, "CodeMirror-breakpoints", null);
            } else {
                server.emit('debug/set-breakpoint', n + 1);
                cm.setGutterMarker(n, "CodeMirror-breakpoints", makeMarker());
            }
        });
    }

    open(path:string) {
        this.files.readFile(path)
            .then(file =>
                this.codeMirror.getDoc().setValue(file));
    }
}