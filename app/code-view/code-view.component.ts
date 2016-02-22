import {Component, Input, ElementRef} from "angular2/core";

@Component({
    selector: "code-view",
    template: ""
})
export class CodeViewComponent {
    @Input() set code(code:string) {
        if (code === undefined) return;

        CodeMirror.runMode(
            typeof code === "string" ? code : code.toString(),
            "vdm",
            this.el.nativeElement
        );
    }

    constructor(private el:ElementRef) {

    }
}