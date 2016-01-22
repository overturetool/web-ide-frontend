import {Component, Input} from "angular2/core";
import {DebugService} from "./DebugService";
import {NgFor} from "angular2/common";
import {TreeComponent} from "../tree/tree.component";

@Component({
    selector: "debug",
    templateUrl: "app/debug/debug.component.html",
    directives: [NgFor, TreeComponent]
})
export class DebugComponent {
    @Input() file:string;

    entry:string = "Parts(1, bom)"; // TODO: Remove this.

    constructor(private debug:DebugService) { }

    connect() {
        this.debug.connect(this.file, this.entry);
    }
}