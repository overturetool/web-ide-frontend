import {Component} from "angular2/core";
import {HostListener} from "angular2/core";
import {ViewChild} from "angular2/core";
import {ElementRef} from "angular2/core";
import {ReplService} from "./ReplService";
import {CodeViewComponent} from "../code-view/code-view.component";

@Component({
    selector: "repl",
    templateUrl: "app/repl/repl.component.html",
    directives: [CodeViewComponent]
})
export class ReplComponent {
    expression:string = "";
    historyPtr:number = 0;
    evaluating:boolean = false;

    @ViewChild("input") inputElement:ElementRef;

    constructor(private replService:ReplService,
                private el:ElementRef) {
    }

    @HostListener('click')
    focus() {
        this.inputElement.nativeElement.focus();
        this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight - this.el.nativeElement.clientHeight;
    }

    evaluate() {
        if (this.evaluating || this.expression === "") return;

        this.evaluating = true;

        this.replService
            .evaluate(this.expression)
            .subscribe(() => {
                this.evaluating = false;
                this.historyPtr = this.replService.items.length;
                this.expression = "";
                setTimeout(() => this.focus(), 0);
            });
    }

    selectPrev(event):void {
        event.preventDefault();

        if (this.historyPtr > 0)
            this.expression = this.replService.items[--this.historyPtr].expression;
        else
            this.expression = this.replService.items[this.historyPtr].expression;
    }

    selectNext(event):void {
        event.preventDefault();

        if (this.historyPtr < this.replService.items.length)
            this.historyPtr++;

        if (this.historyPtr < this.replService.items.length)
            this.expression = this.replService.items[this.historyPtr].expression;
        else
            this.expression = "";
    }
}
