import {FilesService} from "./FilesService";
import {Input} from "angular2/core";
import {Component} from "angular2/core";
import {DirectoryNodeComponent} from "./directory-node.component";
import {FileNodeComponent} from "./file-node.component";
import {DirectoriesPipe} from "./directories.pipe";
import {FilesPipe} from "./files.pipe";
import {NgZone} from "angular2/core";

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

    constructor(private filesService: FilesService) {

    }

    private contextmenu(event) {
        event.preventDefault();
    }

    private toggle() {
        this.open = !this.open;
    }

    private drop() {
        this.filesService.moveFileTo(this.project);
        this.draggedOver = false;
    }

    private dragover(event) {
        if (this.filesService.movingFile.parent === this.project) return;

        event.preventDefault();
        this.draggedOver = true;
    }

    private dragleave() {
        this.draggedOver = false;
    }
}