import {ElementRef, Component} from "angular2/core";
import {FilesService} from "./FilesService";
import {ProjectNodeComponent} from "./project-node.component";
import {WorkspaceService} from "./WorkspaceService";

@Component({
    selector: "workspace",
    templateUrl: "app/files/workspace.component.html",
    providers: [WorkspaceService],
    directives: [ProjectNodeComponent]
})
export class WorkspaceComponent {
    private workspace;

    constructor(private filesService:FilesService, private workspaceService:WorkspaceService) {
        this.filesService.workspace$.subscribe(workspace => this.workspace = workspace);
    }

    createProject() {
        this.workspaceService.createProject(this.workspace);
    }
}