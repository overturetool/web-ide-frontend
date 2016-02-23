import {Component} from "angular2/core";
import {HostListener} from "angular2/core";
import {ElementRef} from "angular2/core";

@Component({
    selector: "left-resizer",
    template: ""
})
export class LeftResizerComponent {
    private listener;

    constructor(private el: ElementRef) {
        this.listener = this.onMouseMove.bind(this);

        document.addEventListener("mouseup", () => document.removeEventListener("mousemove", this.listener));
    }

    onMouseMove(event) {
        var parent = this.el.nativeElement.parentNode;

        parent.style.width = `${parent.offsetLeft - event.clientX + parent.offsetWidth}px`;
    }

    @HostListener("mousedown")
    onMouseDown() {
        document.addEventListener("mousemove", this.listener);
    }
}