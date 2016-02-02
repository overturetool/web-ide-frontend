import {FilesService} from "./FilesService";
import {Input} from "angular2/core";
import {Component} from "angular2/core";
import {DirectoryNodeComponent} from "./directory-node.component";
import {FileNodeComponent} from "./file-node.component";
import {DirectoriesPipe} from "./directories.pipe";
import {FilesPipe} from "./files.pipe";
import {NgZone} from "angular2/core";
import {ContextMenuComponent} from "../contextmenu/context-menu.component";
import {ProjectTreesService} from "./ProjectTreesService";
import {ViewChild} from "angular2/core";

@Component({
    selector: "project-node",
    templateUrl: "app/files/project-node.component.html",
    directives: [DirectoryNodeComponent, FileNodeComponent, ContextMenuComponent],
    pipes: [DirectoriesPipe, FilesPipe]
})
export class ProjectNodeComponent {
    @Input() project;
    @ViewChild(ContextMenuComponent) contextMenu:ContextMenuComponent;

    private open:boolean = false;
    private draggedOver:boolean = false;

    constructor(private projectTreesService:ProjectTreesService) {

    }

    delete() {
        this.projectTreesService.delete(this.project);
    }

    private onContextMenu(event) {
        this.projectTreesService.select(this);
        this.contextMenu.open(event);
    }

    private toggle() {
        this.open = !this.open;
    }

    private drop() {
        this.projectTreesService.moveTo(this.project);
        this.draggedOver = false;
    }

    private dragover(event) {
        if (this.projectTreesService.movingNode.parent === this.project) return;

        event.preventDefault();
        this.draggedOver = true;
    }

    private dragleave() {
        this.draggedOver = false;
    }
}