import {ElementRef, Component} from "angular2/core";
import {ProjectNodeComponent} from "./project-node.component";
import {WorkspaceService} from "./WorkspaceService";
import {OnInit} from "angular2/core";
import {ExamplesService} from "./ExamplesService";
import {ContextMenuComponent} from "../contextmenu/context-menu.component";
import {ViewChild} from "angular2/core";

@Component({
    selector: "workspace",
    templateUrl: "app/files/workspace.component.html",
    directives: [ProjectNodeComponent, ContextMenuComponent]
})
export class WorkspaceComponent implements OnInit {
    @ViewChild(ContextMenuComponent)
    contextMenu:ContextMenuComponent;

    private workspace;

    constructor(private workspaceService:WorkspaceService,
                private examplesService:ExamplesService) {
        this.workspaceService.workspace$.subscribe(workspace => this.workspace = workspace);
    }

    ngOnInit() {
        this.workspaceService.loadWorkspace();
    }

    private onContextMenu(event) {
        if (event.target.matches("workspace > .wrapper"))

        this.contextMenu.open(event);
    }
}