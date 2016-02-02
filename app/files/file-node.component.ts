import {ElementRef, Component} from "angular2/core";
import {FilesService} from "./FilesService";
import {Input} from "angular2/core";
import {ContextMenuComponent} from "../contextmenu/context-menu.component";
import {FormBuilder} from "angular2/common";
import {Validators} from "angular2/common";
import {RegexValidator} from "../misc/validators/RegexValidator";
import {ProjectTreesService} from "./ProjectTreesService";

@Component({
    selector: "file-node",
    templateUrl: "app/files/file-node.component.html",
    directives: [ContextMenuComponent]
})
export class FileNodeComponent {
    @Input() file;
    active:boolean = false;
    renaming:boolean = false;
    renameForm;

    constructor(private projectTreesService:ProjectTreesService,
                private filesService:FilesService,
                private fb:FormBuilder) {
        this.renameForm = this.fb.group({
            name: ['', RegexValidator.regex(/^[\w\-. ]+$/)]
        });

        this.renameForm.controls.name.valueChanges
            .filter(() => this.renaming)
            .subscribe(name => this.projectTreesService.renameTo(name));
    }

    startRename() {
        this.renaming = true;
        this.renameForm.controls.name.updateValue(this.file.name);
    }

    delete() {
        this.filesService.deleteFile(this.file);
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