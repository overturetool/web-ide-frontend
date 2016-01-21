import {Component, Input, Output, EventEmitter} from "angular2/core";
import {OutlineService} from "./OutlineService";
import {File} from "../files/file";

@Component({
    selector: "outline",
    templateUrl: "app/outline/outline.component.html"
})
export class OutlineComponent {
    @Output() hover:EventEmitter = new EventEmitter();
    @Output() select:EventEmitter = new EventEmitter();

    @Input() set file(file: File) {
        this.outline.update(file);
    }

    constructor(private outline:OutlineService) {
    }

    onEnter(item: OutlineItem):void {
        this.hover.emit(item.location);
    }

    onLeave():void {
        this.hover.emit(null);
    }

    onSelect(item: OutlineItem):void {
        this.select.emit(item.location.startLine);
    }
}
