import {EventEmitter, Component, Output, ElementRef, HostListener} from "angular2/core";

@Component({
    selector: "top-resizer",
    template: ""
})
export class TopResizerComponent {
    @Output() resize:EventEmitter = new EventEmitter();

    private listener;

    constructor(private el:ElementRef) {
        this.listener = this.onMouseMove.bind(this);

        document.addEventListener("mouseup", () => document.removeEventListener("mousemove", this.listener));
    }

    onMouseMove(event) {
        var parent = this.el.nativeElement.parentNode;

        parent.style.height = `${parent.offsetTop - event.clientY + parent.offsetHeight}px`;
        this.resize.emit(null);
    }

    @HostListener("mousedown")
    onMouseDown() {
        document.addEventListener("mousemove", this.listener);
    }
}