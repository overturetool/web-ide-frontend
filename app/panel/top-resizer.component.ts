import {Component} from "angular2/core";
import {HostListener} from "angular2/core";
import {ElementRef} from "angular2/core";

@Component({
    selector: "top-resizer",
    template: ""
})
export class TopResizerComponent {
    private listener;

    constructor(private el: ElementRef) {
        this.listener = this.onMouseMove.bind(this);

        document.addEventListener("mouseup", () => document.removeEventListener("mousemove", this.listener));
    }

    onMouseMove(event) {
        var parent = this.el.nativeElement.parentNode;

        parent.style.height = `${parent.offsetTop - event.clientY + parent.offsetHeight}px`;
    }

    @HostListener("mousedown")
    onMouseDown() {
        document.addEventListener("mousemove", this.listener);
    }
}