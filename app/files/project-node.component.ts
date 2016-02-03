import {FilesService} from "./FilesService";
import {Input} from "angular2/core";
import {Component} from "angular2/core";
import {DirectoryNodeComponent} from "./directory-node.component";
import {FileNodeComponent} from "./file-node.component";
import {DirectoriesPipe} from "./directories.pipe";
import {FilesPipe} from "./files.pipe";
import {NgZone} from "angular2/core";
import {ContextMenuComponent} from "../contextmenu/context-menu.component";
import {ViewChild} from "angular2/core";
import {FormBuilder} from "angular2/common";
import {RegexValidator} from "../misc/validators/RegexValidator";
import {WorkspaceService} from "./WorkspaceService";

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
    active:boolean = false;
    renaming:boolean = false;
    renameForm;

    constructor(private workspaceService:WorkspaceService,
                private fb:FormBuilder) {
        this.renameForm = this.fb.group({
            name: ['', RegexValidator.regex(/^[\w\-. ]+$/)]
        });
    }

    startRename() {
        this.workspaceService.startRename(this, this.project);
        this.renameForm.controls.name.updateValue(this.project.name);
    }

    private onBlur() {
        var name = this.renameForm.controls.name;

        if (name.valid)
            this.workspaceService.renameTo(name.value);

        this.renaming = false;
    }

    private onKeyup(event) {
        if (event.keyCode === 13) this.renaming = false;
    }

    delete() {
        this.workspaceService.delete(this.project);
    }

    private createFile() {
        this.workspaceService.createFile(this.project);
    }

    private createDirectory() {
        this.workspaceService.createDirectory(this.project);
    }

    private onContextMenu(event) {
        this.workspaceService.select(this);
        this.contextMenu.open(event);
    }

    private toggle() {
        this.open = !this.open;
    }

    private drop() {
        this.workspaceService.moveTo(this.project);
        this.draggedOver = false;
    }

    private dragover(event) {
        if (this.workspaceService.movingNode.parent === this.project) return;

        event.preventDefault();
        this.draggedOver = true;
    }

    private dragleave() {
        this.draggedOver = false;
    }
}