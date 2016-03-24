import {Component} from "angular2/core";
import {OutlineService} from "./OutlineService";
import {OutlineItem} from "./OutlineItem";
import {EditorService} from "../editor/EditorService";
import {CodeViewComponent} from "../code-view/code-view.component";

@Component({
    selector: "outline",
    templateUrl: "app/outline/outline.component.html",
    directives: [CodeViewComponent]
})
export class OutlineComponent {
    items:Array<OutlineItem>;

    constructor(private outlineService:OutlineService,
                private editorService:EditorService) {
        this.outlineService.items$.subscribe(items => this.items = items);
    }

    onEnter(item:OutlineItem):void {
        this.editorService.highlight(item.location);
    }

    onLeave():void {
        this.editorService.highlight(null);
    }

    onSelect(item:OutlineItem):void {
        this.editorService.focus(item.location.endLine);
    }
}
