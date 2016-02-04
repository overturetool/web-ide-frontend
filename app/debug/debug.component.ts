import {Component, Input} from "angular2/core";
import {DebugService} from "./DebugService";
import {NgFor} from "angular2/common";
import {TreeComponent} from "../tree/tree.component";
import {WorkspaceService} from "../files/WorkspaceService";

@Component({
    selector: "debug",
    templateUrl: "app/debug/debug.component.html",
    directives: [NgFor, TreeComponent]
})
export class DebugComponent {
    file;
    entry:string = "BAGTEST`TestBagAll()"; // TODO: Remove this default value

    constructor(private debug:DebugService,
                private workspaceService:WorkspaceService) {
        this.workspaceService.currentFile$.subscribe(file => this.file = file);
    }

    connect() {
        this.debug.connect(this.file, this.entry);
    }
}