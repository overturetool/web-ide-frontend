import {Component} from "angular2/core"
import {DebugService} from "./DebugService";

@Component({
    selector: "debug",
    templateUrl: "app/debug/debug.component.html"
})
export class DebugComponent {
    constructor(private debug: DebugService) {

    }
}