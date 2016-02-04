import {ElementRef, Component} from "angular2/core";
import {ProjectNodeComponent} from "./project-node.component";
import {WorkspaceService} from "./WorkspaceService";

@Component({
    selector: "workspace",
    templateUrl: "app/files/workspace.component.html",
    directives: [ProjectNodeComponent]
})
export class WorkspaceComponent {
    private workspace;

    constructor(private workspaceService:WorkspaceService) {
        this.workspaceService.workspace$.subscribe(workspace => this.workspace = workspace);
    }

    createProject() {
        this.workspaceService.newProject(this.workspace);
    }
}