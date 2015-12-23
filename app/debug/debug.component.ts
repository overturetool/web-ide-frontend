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
        this.debug.response.subscribe(response => {
            console.log(response);
        })
    }

    start() {
        this.debug.start(this.file, this.entry);
    }
}