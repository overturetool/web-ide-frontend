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
    context:Array<any> = [];
    stack:Array<any> = [];
    status:string = "stopped";

    @Input() file:string;
    @Output() suspended = new EventEmitter();

    constructor(private debug:DebugService) {
        this.debug.connection.messages.subscribe(res => this.onMessage(res));
    }

    connect() {
        this.debug.connect(this.file, this.entry);
    }

    onMessage(msg) {
        console.log(msg);

        if (msg.init) {
            this.onInit(msg.init);
        } else if (msg.stream && msg.stream.$type === "stdout") {
            this.onStdout(msg.stream);
        } else if (msg.response) {
            this.onResponse(msg.response);
        }
    }

    private onInit(init) {
        this.debug.getStatus();
    }

    private onStdout(stream) {
        alert(stream.keyValue);
        this.debug.getStatus();
    }

    private onResponse(response) {
        if (response.$status) this.status = response.$status;

        if (response.$status === "break") {
            this.debug.getContext();
            this.debug.getStack();
        } else if (response.$status && response.$status !== "break") {
            this.suspended.emit(null);
        }

        if (response.$command === "context_get") {
            this.context = response.property;
        } else if (response.$command === "stack_get") {
            this.stack = response.stack.length ? response.stack : [response.stack];
            this.suspended.emit(this.stack[0].$lineno);
        }
    }
}