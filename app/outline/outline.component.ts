import {Component, Input, Output, EventEmitter} from "angular2/core";
import {OutlineService} from "./OutlineService";
import {Observable} from "rxjs/Observable";

@Component({
    selector: "outline",
    templateUrl: "app/outline/outline.component.html"
})
export class OutlineComponent {
    items:Array<OutlineItem>;

    constructor(private outlineService:OutlineService) {
        this.outlineService.items$.subscribe(items => this.items = items);
    }

    onEnter(item:OutlineItem):void {
        this.outlineService.highlight(item.location);
    }

    onLeave():void {
        this.outlineService.highlight(null);
    }

    onSelect(item:OutlineItem):void {
        this.outlineService.goto(item.location.startLine);
    }
}
