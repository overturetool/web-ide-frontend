import {Component, Input} from "angular2/core";
import {DebugService} from "./DebugService";
import {TreeComponent} from "../tree/tree.component";
import {WorkspaceService} from "../files/WorkspaceService";
import {EditorService} from "../editor/EditorService";
import {StackFrame} from "./StackFrame";
import {CodeViewComponent} from "../code-view/code-view.component";

@Component({
    selector: "debug",
    templateUrl: "app/debug/debug.component.html",
    directives: [CodeViewComponent, TreeComponent]
})
export class DebugComponent {
    file:File;
    entry:string = "BAGTEST`TestBagAll()"; // TODO: Remove this default value

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

    selectFrame(frame:StackFrame):void {
        this.debug.getContext(frame);
        this.focus(frame.file, frame.line);
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