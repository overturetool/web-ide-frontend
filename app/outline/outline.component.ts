import {Component, Input, Output, EventEmitter} from "angular2/core";
import {OutlineService} from "./OutlineService";

@Component({
    selector: "outline",
    templateUrl: "app/outline/outline.component.html"
})
export class OutlineComponent {
    @Input() set file(file) { this.outlineService.update(file) }

    @Output() hover:EventEmitter = new EventEmitter();
    @Output() select:EventEmitter = new EventEmitter();

    private items:Array<OutlineItem>;

    constructor(private outlineService:OutlineService) {
        outlineService.outline
            .subscribe(items => this.items = items);
    }

    onHover(item: OutlineItem):void {
        this.hover.emit(item.location);
    }

    onStopHover():void {
        this.hover.emit(null);
    }

    onSelect(item: OutlineItem):void {
        this.select.emit(item.location.startLine);
    }
}
