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
    historyPtr:number = 0;

    constructor(private replService:ReplService) {
    }

    evaluate() {
        if (!this.replService.evaluate(this.input)) return;

        this.historyPtr = this.replService.items.length +1;
        this.input = "";
    }

    selectPrev(event):void {
        event.preventDefault();

        if (this.historyPtr > 0)
            this.input = this.replService.items[--this.historyPtr].expression;
        else
            this.input = this.replService.items[this.historyPtr].expression;
    }

    selectNext(event):void {
        event.preventDefault();

        if (this.historyPtr < this.replService.items.length)
            this.historyPtr++;

        if (this.historyPtr < this.replService.items.length)
            this.input = this.replService.items[this.historyPtr].expression;
        else
            this.input = "";
    }
}
