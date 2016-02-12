import {Component, Directive, Input, QueryList,
    ViewContainerRef, TemplateRef, ContentChildren} from 'angular2/core';
import {Output} from "angular2/core";
import {EventEmitter} from "angular2/core";
import {EditorComponent} from "./editor.component";
import {OnInit} from "angular2/core";
import {WorkspaceService} from "../files/WorkspaceService";
import {DebugService} from "../debug/DebugService";
import "rxjs/add/operator/filter";
import {EditorService} from "./EditorService";

@Component({
    selector: 'editor-tabs',
    templateUrl: 'app/editor/editor-tabs.component.html',
    directives: [EditorComponent]
})
export class EditorTabsComponent {
    files:Array<File> = [];
    current:File = null;

    constructor(private editorService:EditorService) {
        this.editorService.openFiles$.subscribe(files => this.files = files);
        this.editorService.currentFile$.subscribe(file => this.current = file);
    }

    private click(event, file) {
        if (event.button === 0)
            this.select(file);
        else if (event.button === 1) {
            this.close(file);
        }
    }

    select(file) {
        file.open();
    }

    close(file) {
        file.close();
    }
}