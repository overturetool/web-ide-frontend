import {ElementRef, Component} from "angular2/core";
import {FilesService} from "./FilesService";
import {Input} from "angular2/core";
import {ContextMenuComponent} from "../contextmenu/context-menu.component";

@Component({
    selector: "file-node",
    templateUrl: "app/files/file-node.component.html",
    directives: [ContextMenuComponent]
})
export class FileNodeComponent {
    @Input() file;
    active:boolean = false;

    constructor(private filesService:FilesService) {

    }

    delete() {
        this.filesService.deleteFile(this.file);
    }

    private click(event) {
        if (event.button === 0)
            this.filesService.openFile(this.file.path);

        this.filesService.selectFile(this);
    }

    private dragstart(event) {
        this.filesService.registerMove(this.file);
    }
}