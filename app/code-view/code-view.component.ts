import {Component, Input, ElementRef} from "angular2/core";

@Component({
    selector: "code-view",
    template: ""
})
export class CodeViewComponent {
    @Input() set code(code:string) {
        if (code) CodeMirror.runMode(code, "vdm", this.el.nativeElement);
    }

    constructor(private el:ElementRef) {

    }
}