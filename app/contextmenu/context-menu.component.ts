import {ContextMenuService} from "./ContextMenuService";
import {Component} from "angular2/core";

@Component({
    selector: "context-menu",
    templateUrl: "app/contextmenu/context-menu.component.html"
})
export class ContextMenuComponent {
    constructor(private contextMenuService:ContextMenuService) {
        
    }
}