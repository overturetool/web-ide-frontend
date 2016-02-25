import {Component, Input, ElementRef} from "angular2/core";
import callSignatureElement = ts.ScriptElementKind.callSignatureElement;

@Component({
    selector: "code-view",
    template: ""
})
export class CodeViewComponent {
    @Input()
    set code(code:string) {
        code = typeof code === "string" ? code : code.toString();

        if (code.indexOf("\n") !== -1) {
            var pre = document.createElement('pre');

            CodeMirror.runMode(code, "vdm", (text, type) => {
                var span = document.createElement('span');

                span.innerHTML = text;
                if (type) span.className = `cm-${type}`;

                pre.appendChild(span);
            });

            this.el.nativeElement.appendChild(pre);
        } else {
            CodeMirror.runMode(code, "vdm", this.el.nativeElement);
        }
    }

    constructor(private el:ElementRef) {

}
}