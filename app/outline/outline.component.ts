import {Component, Input, Output, EventEmitter} from "angular2/core";
import {OutlineService} from "./OutlineService";
import {FilesService} from "../files/FilesService";
import {Observable} from "rxjs/Observable";

@Component({
    selector: "outline",
    templateUrl: "app/outline/outline.component.html"
})
export class OutlineComponent {
    items$;

    constructor(private outlineService:OutlineService) {
        this.items$ = this.outlineService.items$;
    }

    onEnter(item:OutlineItem):void {
        this.outlineService.highlight(item.location);
    }

    onLeave():void {
        this.outlineService.highlight(null);
    }

    onSelect(item:OutlineItem):void {
        this.outlineService.focus(item.location.startLine);
    }
}
