import {ElementRef, Component} from "angular2/core";
import {FilesService} from "./FilesService";
import {Input} from "angular2/core";
import {ContextMenuComponent} from "../contextmenu/context-menu.component";
import {FormBuilder} from "angular2/common";
import {Validators} from "angular2/common";
import {RegexValidator} from "../misc/validators/RegexValidator";
import {ProjectTreesService} from "./ProjectTreesService";
import {ViewChild} from "angular2/core";

@Component({
    selector: "file-node",
    templateUrl: "app/files/file-node.component.html",
    directives: [ContextMenuComponent]
})
export class FileNodeComponent {
    @Input() file;
    @ViewChild(ContextMenuComponent) contextMenu:ContextMenuComponent;

    active:boolean = false;
    renaming:boolean = false;
    renameForm;

    constructor(private projectTreesService:ProjectTreesService,
                private filesService:FilesService,
                private fb:FormBuilder) {
        this.renameForm = this.fb.group({
            name: ['', RegexValidator.regex(/^[\w\-. ]+$/)]
        });
    }

    startRename() {
        this.projectTreesService.startRename(this, this.file);
        this.renameForm.controls.name.updateValue(this.file.name);
    }

    delete() {
        this.projectTreesService.delete(this.file);
    }

    private onBlur() {
        var name = this.renameForm.controls.name;

        if (name.valid)
            this.projectTreesService.renameTo(name.value);

        this.renaming = false;
    }

    private onKeyup(event) {
        if (event.keyCode !== 13) return;

        var name = this.renameForm.controls.name;

        if (name.valid) {
            this.projectTreesService.renameTo(name.value);
            this.renaming = false;
        }
    }

    private onContextMenu(event) {
        this.projectTreesService.select(this);
        this.contextMenu.open(event);
    }

    private click(event) {
        if (event.button === 0)
            this.filesService.openFile(this.file.path);

        this.projectTreesService.select(this);
    }

    private dragstart(event) {
        this.projectTreesService.startMove(this.file);
    }
}