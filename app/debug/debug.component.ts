import {Component, Input} from "angular2/core";
import {DebugService} from "./DebugService";
import {NgFor} from "angular2/common";

@Component({
    selector: "debug",
    templateUrl: "app/debug/debug.component.html",
    directives: [NgFor]
})
export class DebugComponent {
    entry:string = "Parts(1, bom)"; // TODO: Remove this.

    @Input() file:string;

    constructor(private debug:DebugService) { }

    connect() {
        this.debug.connect(this.file, this.entry);
    }
}