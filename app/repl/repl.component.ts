import {Component} from "angular2/core";
import {ReplService} from "./ReplService";
import {CodeViewComponent} from "../code-view/code-view.component";

@Component({
    selector: "repl",
    templateUrl: "app/repl/repl.component.html",
    directives: [CodeViewComponent]
})
export class ReplComponent {
    input:string = "";
    history:Array<string> = [];
    historyPtr:number = -1;

    constructor(private replService:ReplService) {
    }

    evaluate() {
        this.replService.evaluate(this.input);
        this.history.push(this.input);
        this.historyPtr = this.history.length;
        this.input = "";
    }

    selectPrev(event):void {
        event.preventDefault();

        this.historyPtr = this.historyPtr > 0 ? this.historyPtr -1 : 0;

        this.input = this.history[this.historyPtr];
    }

    selectNext(event):void {
        event.preventDefault();

        this.historyPtr = this.historyPtr < this.history.length ? this.historyPtr +1 : this.history.length;

        this.input = this.history[this.historyPtr];
    }
}
