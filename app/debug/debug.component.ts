import {Component, Input} from "angular2/core";
import {DebugService} from "./DebugService";
import {NgFor} from "angular2/common";
import {TreeComponent} from "../tree/tree.component";
import {WorkspaceService} from "../files/WorkspaceService";
import {EditorService} from "../editor/EditorService";

@Component({
    selector: "debug",
    templateUrl: "app/debug/debug.component.html",
    directives: [NgFor, TreeComponent]
})
export class DebugComponent {
    file;
    entry:string = "Parts(1,bom)"; // TODO: Remove this default value

    constructor(private debug:DebugService,
                private editorService:EditorService) {
        this.editorService.currentFile$.subscribe(file => this.file = file);
    }

    connect() {
        this.debug.connect(this.file, this.entry);
    }

    getLine(file:File, line:number):string {
        return file.document.getLine(line-1);
    }

    focus(file:File, line:number):void {
        file.open();
        this.editorService.focus(line);
    }

    goto(file:File, line:number, char:number):void {
        file.open();
        this.editorService.goto(line, char);
    }
}