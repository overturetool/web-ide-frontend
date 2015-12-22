import {Component, Input} from "angular2/core"
import {DebugService} from "./DebugService";

@Component({
    selector: "debug",
    templateUrl: "app/debug/debug.component.html"
})
export class DebugComponent {
    entry:string = "Parts(1, bom)";

    @Input() file:string;

    constructor(private debug: DebugService) {

    }

    start() {
        this.debug.start(this.file, this.entry);
    }
}