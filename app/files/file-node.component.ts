import {ElementRef, Component} from "angular2/core";
import {FilesService} from "./FilesService";
import {Input} from "angular2/core";

@Component({
    selector: "file-node",
    templateUrl:"app/files/file-node.component.html"
})
export class FileNodeComponent {
    @Input() file;

    constructor(private filesService: FilesService) {

    }

    private contextmenu(event) {
        event.preventDefault();
    }

    private click(event) {
        if (event.button === 0)
            this.filesService.openFile(this.file.path);
    }

    private dragstart(event) {
        this.filesService.registerMove(this.file);
    }
}