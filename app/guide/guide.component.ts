import {Component, OnDestroy} from "angular2/core";

@Component({
    selector: 'guide',
    templateUrl: 'app/guide/guide.component.html'
})
export class GuideComponent {
    step:number = 0;

    constructor() {
        document.addEventListener('keyup', event => {
            if (event.key == "ArrowLeft") this.prev();
            if (event.key == "ArrowRight") this.next();
        });
    }

    prev() {
        this.step = this.step > 0 ? this.step -1 : 0;
    }

    next() {
        this.step = this.step < 5 ? this.step +1 : 0;
    }
}