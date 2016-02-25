import {Component, Input} from "angular2/core";
import {TreeComponent} from "../tree/tree.component";
import {WorkspaceService} from "../files/WorkspaceService";
import {EditorService} from "../editor/EditorService";
import {StackFrame} from "./StackFrame";
import {CodeViewComponent} from "../code-view/code-view.component";
import {DbgpDebugger} from "./DbgpDebugger";
import {Project} from "../files/Project";

@Component({
    selector: "debug",
    templateUrl: "app/debug/debug.component.html",
    directives: [CodeViewComponent, TreeComponent]
})
export class DebugComponent {
    project:Project;
    entry:string;

    constructor(private editorService:EditorService) {
        this.editorService.currentProject$.subscribe(project => {
            this.project = project;

            if (this.project) this.entry = this.project.getEntryPoints()[0];
        });
    }

    connect() {
        this.project.debug.connect(this.entry);
    }

    getLine(file:File, line:number):string {
        return file.document.getLine(line-1);
    }

    selectFrame(frame:StackFrame):void {
        this.project.debug.getContext(frame);
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