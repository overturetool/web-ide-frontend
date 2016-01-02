import {Component, Input} from "angular2/core";
import {OutlineService} from "./OutlineService";

@Component({
    selector: "outline",
    templateUrl: "app/outline/outline.component.html"
})
export class OutlineComponent {
    private _file: string;
    private _outline: Array<any>;

    @Input() set file(file:string) {
        this._file = file;

        if (!file) return;

        this.outlineService
            .getOutline(file)
            .then(outline => this._outline = outline);
    }
    get file():string {
        return this._file;
    }

    constructor(private outlineService: OutlineService) {

    }
}
