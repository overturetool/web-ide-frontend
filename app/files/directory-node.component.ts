import {ElementRef, Component} from "angular2/core";
import {FilesService} from "./FilesService";
import {Input} from "angular2/core";
import {FileNodeComponent} from "./file-node.component";
import {DirectoriesPipe} from "./directories.pipe";
import {FilesPipe} from "./files.pipe";
import {NgZone} from "angular2/core";
import {ContextMenuComponent} from "../contextmenu/context-menu.component";
import {ProjectTreesService} from "./ProjectTreesService";
import {ViewChild} from "angular2/core";

@Component({
    selector: "directory-node",
    templateUrl: "app/files/directory-node.component.html",
    directives: [DirectoryNodeComponent, FileNodeComponent, ContextMenuComponent],
    pipes: [DirectoriesPipe, FilesPipe]
})
export class DirectoryNodeComponent {
    @Input() directory;
    @ViewChild(ContextMenuComponent) contextMenu:ContextMenuComponent;

    private open:boolean = false;
    private draggedOver:boolean = false;

    constructor(private projectTreesService:ProjectTreesService) {

    }

    delete() {
        this.projectTreesService.delete(this.directory);
    }

    private onContextMenu(event) {
        this.projectTreesService.select(this);
        this.contextMenu.open(event);
    }

    private toggle() {
        this.open = !this.open;
    }

    private dragstart(event) {
        this.projectTreesService.startMove(this.directory);
    }

    private drop() {
        this.projectTreesService.moveTo(this.directory);
        this.draggedOver = false;
    }

    private dragover(event) {
        if (this.projectTreesService.movingNode.parent === this.directory) return;
        if (this.projectTreesService.movingNode === this.directory) return;

        event.preventDefault();
        this.draggedOver = true;
    }

    private dragleave() {
        this.draggedOver = false;
    }
}