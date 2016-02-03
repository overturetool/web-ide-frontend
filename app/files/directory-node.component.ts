import {ElementRef, Component} from "angular2/core";
import {FilesService} from "./FilesService";
import {Input} from "angular2/core";
import {FileNodeComponent} from "./file-node.component";
import {DirectoriesPipe} from "./directories.pipe";
import {FilesPipe} from "./files.pipe";
import {NgZone} from "angular2/core";
import {ContextMenuComponent} from "../contextmenu/context-menu.component";
import {ViewChild} from "angular2/core";
import {RegexValidator} from "../misc/validators/RegexValidator";
import {FormBuilder} from "angular2/common";
import {WorkspaceService} from "./WorkspaceService";

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
        this.workspaceService.startRename(this, this.directory);
        this.renameForm.controls.name.updateValue(this.directory.name);
    }

    private onBlur() {
        var name = this.renameForm.controls.name;

        if (name.valid)
            this.workspaceService.renameTo(name.value);

        this.renaming = false;
    }

    private onKeyup(event) {
        if (event.keyCode !== 13) return;

        var name = this.renameForm.controls.name;

        if (name.valid) {
            this.workspaceService.renameTo(name.value);
            this.renaming = false;
        }
    }

    delete() {
        this.workspaceService.delete(this.directory);
    }

    private onContextMenu(event) {
        this.workspaceService.select(this);
        this.contextMenu.open(event);
    }

    private createFile() {
        this.workspaceService.createFile(this.directory);
    }

    private createDirectory() {
        this.workspaceService.createDirectory(this.directory);
    }

    private toggle() {
        this.open = !this.open;
    }

    private dragstart(event) {
        this.workspaceService.startMove(this.directory);
    }

    private drop() {
        this.workspaceService.moveTo(this.directory);
        this.draggedOver = false;
    }

    private dragover(event) {
        if (this.workspaceService.movingNode.parent === this.directory) return;
        if (this.workspaceService.movingNode === this.directory) return;

        event.preventDefault();
        this.draggedOver = true;
    }

    private dragleave() {
        this.draggedOver = false;
    }
}