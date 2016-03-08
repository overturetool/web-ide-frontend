import {ElementRef, Component} from "angular2/core";
import {Input} from "angular2/core";
import {ContextMenuComponent} from "../contextmenu/context-menu.component";
import {FormBuilder} from "angular2/common";
import {Validators} from "angular2/common";
import {RegexValidator} from "../misc/validators/RegexValidator";
import {ViewChild} from "angular2/core";
import {WorkspaceService} from "./WorkspaceService";
import {File} from "./File";

@Component({
    selector: "file-node",
    templateUrl: "app/files/file-node.component.html",
    directives: [ContextMenuComponent]
})
export class FileNodeComponent {
    private _file;

    @Input()
    set file(f:File) {
        this._file = f;

        if (f.shouldRename)
            this.startRename();
    };
    get file() {
        return this._file;
    }

    @ViewChild(ContextMenuComponent)
    contextMenu:ContextMenuComponent;

    @ViewChild("renameInput")
    set renameInput(el:ElementRef) {
        if (el) el.nativeElement.select();
    }

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
        this.workspaceService.startRename(this, this.file);
        this.renameForm.controls.name.updateValue(this.file.name);
    }

    delete() {
        this.file.delete();
    }

    rename() {
        var name = this.renameForm.controls.name;

        this.file.shouldRename = false;

        if (name.valid && name.value !== this.file.name)
            this.file.rename(name.value);

        this.renameForm.controls.name.updateValue("");
        this.renaming = false;
    }

    private onKeyup(event) {
        if (event.keyCode === 13)
            this.rename();
    }

    private onContextMenu(event) {
        this.workspaceService.select(this);
        this.contextMenu.open(event);
    }

    private onClick() {
        this.workspaceService.select(this);
    }

    private onDblClick(event) {
        this.workspaceService.select(this);

        if (event.button === 0)
            this.file.open();
    }

    private dragstart(event) {
        this.workspaceService.startMove(this.file);
    }
}