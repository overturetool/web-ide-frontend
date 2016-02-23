import {Component, HostBinding, ViewChild, ElementRef} from "angular2/core";

@Component({
    selector: "quick-bar",
    templateUrl: "app/quick-bar/quick-bar.component.html"
})
export class QuickBarComponent {
    @HostBinding("class.active") active:boolean = false;
    @ViewChild("input") inputElement:ElementRef;
    expression:string = "";
    actions:Array = [];

    constructor() {
        document.addEventListener('keyup', this.onKeyup.bind(this));
        document.addEventListener('keydown', this.onKeydown.bind(this));
    }

    onKeydown(event:KeyboardEvent) {
        // Ctrl + P
        if (event.ctrlKey && event.keyCode === 80)
            event.preventDefault();
    }

    onKeyup(event:KeyboardEvent):void {
        // Ctrl + P
        if (event.ctrlKey && event.keyCode === 80)
            this.open();

        // Escape
        if (event.keyCode === 27)
            this.close();

        // Enter
        if (event.keyCode === 27)
            this.evaluate();
    }

    open(prefix:string = "") {
        this.active = true;
        this.expression = prefix;

        setTimeout(() => this.inputElement.nativeElement.focus(), 0);
    }

    close() {
        this.active = false;
        this.expression = "";
    }

    evaluate(action) {
        // TODO: Do stuff

        this.close();
    }
}