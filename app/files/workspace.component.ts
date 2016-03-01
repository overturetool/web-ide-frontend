import {ElementRef, Component} from "angular2/core";
import {ProjectNodeComponent} from "./project-node.component";
import {WorkspaceService} from "./WorkspaceService";
import {OnInit} from "angular2/core";

@Component({
    selector: "workspace",
    templateUrl: "app/files/workspace.component.html",
    directives: [ProjectNodeComponent]
})
export class WorkspaceComponent implements OnInit {
    private workspace;

    constructor(private workspaceService:WorkspaceService) {


        this.workspaceService.workspace$.subscribe(workspace => this.workspace = workspace);
    }

    ngOnInit() {
        this.workspaceService.loadWorkspace();
    }

    createProject() {
        this.workspaceService.newProject(this.workspace);
    }
}