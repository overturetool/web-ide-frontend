import {Component} from "angular2/core";
import {OutlineService} from "./OutlineService";

@Component({
    selector: "outline",
    templateUrl: "app/outline/outline.component.html"
})
export class OutlineComponent {
    public outline: Array<any>;

    constructor(private outlineService: OutlineService) {

    }

    update(path) {
        this.outlineService
            .getOutline(path)
            .then(outline =>
                this.outline = outline);
    }
}
