import {Component, ViewChild, ElementRef, HostListener} from "angular2/core";
import {CodeViewComponent} from "../code-view/code-view.component";
import {ReplService} from "./ReplService";

@Component({
    selector: "repl",
    directives: [CodeViewComponent],
    template: `
<div class="items">
    <div *ngFor="#item of replService.items" class="item">
        <div>
            <code>&gt;&nbsp;</code><code-view [code]="item.expression"></code-view>
        </div>
        <code-view *ngIf="item.type == 'code'" [code]="item.result"></code-view>
        <div *ngIf="item.type == 'error'" class="msg error">{{item.result}}</div>
    </div>
    <div class="input">
        <code>&gt;&nbsp;</code>
        <input #input
               [(ngModel)]="expression"
               (keyup.enter)="evaluate()"
               (keyup.arrowup)="selectPrev($event)"
               (keyup.arrowdown)="selectNext($event)">
    </div>
</div>`
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
