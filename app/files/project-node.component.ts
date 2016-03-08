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
import {ElementRef} from "angular2/core";
import {Project} from "./Project";

@Component({
    selector: "project-node",
    templateUrl: "app/files/project-node.component.html",
    directives: [DirectoryNodeComponent, FileNodeComponent, ContextMenuComponent],
    pipes: [DirectoriesPipe, FilesPipe]
})
export class ProjectNodeComponent {
    private _project;

    @Input()
    set project(d:Project) {
        this._project = d;

        if (d.shouldRename)
            this.startRename();
    }
    get project() {
        return this._project;
    }

    @ViewChild("renameInput")
    set renameInput(el:ElementRef) {
        if (el) el.nativeElement.select();
    }

    @ViewChild(ContextMenuComponent) contextMenu:ContextMenuComponent;

    private open:boolean = false;
    private draggedOver:boolean = false;
    active:boolean = false;
    renaming:boolean = false;
    renameForm;

    constructor(private workspaceService:WorkspaceService,
                private fb:FormBuilder) {
        this.renameForm = this.fb.group({
            name: ['', RegexValidator.regex(/^[A-Za-z_\-\.][A-Za-z0-9_\-\.]+$/)]
        });
    }

    startRename() {
        this.workspaceService.startRename(this, this.project);
        this.renameForm.controls.name.updateValue(this.project.name);
    }

    rename() {
        var name = this.renameForm.controls.name;

        this.project.shouldRename = false;

        if (name.valid && name.value !== this.project.name)
            this.project.rename(name.value);

        this.renameForm.controls.name.updateValue("");
        this.renaming = false;
    }

    private onKeyup(event) {
        if (event.keyCode === 13)
            this.rename();
    }

    delete() {
        this.project.delete();
    }

    private createFile() {
        this.workspaceService.newFile(this.project);
    }

    private createDirectory() {
        this.workspaceService.newDirectory(this.project);
    }

    private toggle() {
        this.open = !this.open;
    }

    private drop() {
        this.project.move(this.workspaceService.movingNode);
        this.draggedOver = false;
    }

    private dragover(event) {
        if (this.workspaceService.movingNode.parent === this.project) return;

        event.preventDefault();
        this.draggedOver = true;
    }

    private onContextMenu(event) {
        this.workspaceService.select(this);
        this.contextMenu.open(event);
    }

    private onClick() {
        this.workspaceService.select(this);
    }

    private onDblClick() {
        this.workspaceService.select(this);
        this.toggle();
    }

    private dragleave() {
        this.draggedOver = false;
    }
}