import {Component} from "angular2/core";
import {HostListener} from "angular2/core";
import {ElementRef} from "angular2/core";

@Component({
    selector: "right-resizer",
    template: ""
})
export class RightResizerComponent {
    private listener;

    constructor(private el: ElementRef) {
        this.listener = this.onMouseMove.bind(this);

        document.addEventListener("mouseup", () => document.removeEventListener("mousemove", this.listener));
    }

    onMouseMove(event) {
        var parent = this.el.nativeElement.parentNode;

        parent.style.width = `${event.clientX - parent.offsetLeft}px`;
    }

    @HostListener("mousedown")
    onMouseDown() {
        document.addEventListener("mousemove", this.listener);
    }
}