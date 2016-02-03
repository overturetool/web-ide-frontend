import {Component, Input} from "angular2/core";
import {DebugService} from "./DebugService";
import {NgFor} from "angular2/common";
import {TreeComponent} from "../tree/tree.component";
import {FilesService} from "../files/FilesService";

@Component({
    selector: "debug",
    templateUrl: "app/debug/debug.component.html",
    directives: [NgFor, TreeComponent]
})
export class DebugComponent {
    file;
    entry:string = "Parts(1, bom)"; // TODO: Remove this default value

    constructor(private debug:DebugService,
                private filesService:FilesService) {
        this.filesService.currentFile$.subscribe(file => this.file = file);
    }

    connect() {
        this.debug.connect(this.file, this.entry);
    }
}