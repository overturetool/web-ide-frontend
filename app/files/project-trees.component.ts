import {ElementRef, Component} from "angular2/core";
import {FilesService} from "./FilesService";
import {ProjectNodeComponent} from "./project-node.component";

@Component({
    selector: "project-trees",
    templateUrl: "app/files/project-trees.component.html",
    directives: [ProjectNodeComponent]
})
export class ProjectTreesComponent {
    private projects:Array = [];

    constructor(private filesService:FilesService, private element:ElementRef) {
        this.filesService.projects$.subscribe(projects => this.projects = projects);
    }
}