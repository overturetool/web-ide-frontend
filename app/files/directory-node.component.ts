import {ElementRef, Component} from "angular2/core";
import {FilesService} from "./FilesService";
import {Input} from "angular2/core";
import {FileNodeComponent} from "./file-node.component";
import {DirectoriesPipe} from "./directories.pipe";
import {FilesPipe} from "./files.pipe";

@Component({
    selector: "directory-node",
    templateUrl: "app/files/directory-node.component.html",
    directives: [DirectoryNodeComponent, FileNodeComponent],
    pipes: [DirectoriesPipe, FilesPipe]
})
export class DirectoryNodeComponent {
    @Input() directory;
    private open:boolean = false;
    private draggedOver:boolean = false;

    constructor(private filesService: FilesService) {

    }

    private toggle() {
        this.open = !this.open;
    }

    private dragstart(event) {
        event.dataTransfer.setData("file", this.directory);
        event.dataTransfer.effectAllowed = "move";
    }

    private drop(event) {
        var file = event.dataTransfer.getData("file");
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