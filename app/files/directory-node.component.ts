import {ElementRef, Component} from "angular2/core";
import {FilesService} from "./FilesService";
import {Input} from "angular2/core";
import {FileNodeComponent} from "./file-node.component";
import {DirectoriesPipe} from "./directories.pipe";
import {FilesPipe} from "./files.pipe";
import {NgZone} from "angular2/core";
import {ContextMenuComponent} from "../contextmenu/context-menu.component";

@Component({
    selector: "directory-node",
    templateUrl: "app/files/directory-node.component.html",
    directives: [DirectoryNodeComponent, FileNodeComponent, ContextMenuComponent],
    pipes: [DirectoriesPipe, FilesPipe]
})
export class DirectoryNodeComponent {
    @Input() directory;
    private open:boolean = false;
    private draggedOver:boolean = false;

    constructor(private filesService:FilesService) {

    }

    delete() {
        this.filesService.deleteFile(this.directory);
    }

    private click() {
        this.filesService.selectFile(this);
    }

    private toggle() {
        this.open = !this.open;
    }

    private dragstart(event) {
        this.filesService.registerMove(this.directory);
    }

    private drop() {
        this.filesService.moveFileTo(this.directory);
        this.draggedOver = false;
    }

    private dragover(event) {
        if (this.filesService.movingFile.parent === this.directory) return;
        if (this.filesService.movingFile === this.directory) return;

        event.preventDefault();
        this.draggedOver = true;
    }

    private dragleave() {
        this.draggedOver = false;
    }
}