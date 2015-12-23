import {Component, Input} from "angular2/core"
import {DebugService} from "./DebugService";
import {NgFor} from "angular2/common";
import {Output} from "angular2/core";
import {EventEmitter} from "angular2/core";

@Component({
    selector: "debug",
    templateUrl: "app/debug/debug.component.html",
    directives: [NgFor]
})
export class DebugComponent {
    entry:string = "Parts(1, bom)";
    context: Array<any> = [];
    stack: Array<any> = [];

    @Input() file:string;
    @Output() suspended = new EventEmitter();

    constructor(private debug: DebugService) {
        this.debug.response.subscribe(res => this.onResponse(res));
    }

    start() {
        this.debug.start(this.file, this.entry);
    }

    onResponse(res) {
        console.log(res);

        if (res.stream && res.stream.$type === "stdout") {
            alert(res.stream.keyValue);
        } else if (res.response) {
            var msg = res.response;

            if (msg.$command === "run" && msg.$status === "break" && msg.$reason === "ok") {
                this.debug.getContext();
                this.debug.getStack();
                this.debug.getStatus();
            } else if (msg.$command === "context_get") {
                this.context = msg.property;
            } else if (msg.$command === "stack_get") {
                this.stack = msg.stack;

                if (msg.stack.$level === 0) {
                    this.suspended.emit(msg.stack.$lineno);
                }
            }
        }
    }

}