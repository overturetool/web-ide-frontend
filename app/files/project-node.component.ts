import {FilesService} from "./FilesService";
import {Input} from "angular2/core";
import {Component} from "angular2/core";
import {DirectoryNodeComponent} from "./directory-node.component";
import {FileNodeComponent} from "./file-node.component";
import {DirectoriesPipe} from "./directories.pipe";
import {FilesPipe} from "./files.pipe";

@Component({
    selector: "project-node",
    templateUrl: "app/files/project-node.component.html",
    directives: [DirectoryNodeComponent, FileNodeComponent],
    pipes: [DirectoriesPipe, FilesPipe]
})
export class ProjectNodeComponent {
    @Input() project;
    private open:boolean = false;
    private draggedOver:boolean = false;

    private toggle() {
        this.open = !this.open;
    }

    private drop(event) {
        var file = event.dataTransfer.getData("file");
        this.draggedOver = false;
    }

    private dragover(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";

        this.draggedOver = true;
    }

    private dragleave(event) {
        this.draggedOver = false;
    }
}