import {Component, OnDestroy} from "angular2/core";
import {EditorService} from "../editor/EditorService";
import {HostBinding} from "angular2/core";

@Component({
    selector: 'guide',
    templateUrl: 'app/guide/guide.component.html'
})
export class GuideComponent {
    step:number = 0;
    @HostBinding('class.active') active:boolean = false;

    constructor(editorService:EditorService) {
        editorService.currentFile$.subscribe(file => this.active = !file);

        document.addEventListener('keyup', event => {
            if ((event.key || event.code) == "ArrowLeft") this.prev();
            if ((event.key || event.code) == "ArrowRight") this.next();
        });
    }

    prev() {
        this.step = this.step > 0 ? this.step -1 : 0;
    }

    next() {
        this.step = this.step < 5 ? this.step +1 : 0;
    }
}