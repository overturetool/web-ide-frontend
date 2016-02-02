import {Component, Directive, Input, QueryList,
    ViewContainerRef, TemplateRef, ContentChildren} from 'angular2/core';
import {Output} from "angular2/core";
import {EventEmitter} from "angular2/core";
import {FilesService} from "../files/FilesService";
import {EditorComponent} from "./editor.component";
import {OnInit} from "angular2/core";

@Component({
    selector: 'editor-tabs',
    templateUrl: 'app/editor/editor-tabs.component.html',
    directives: [EditorComponent]
})
export class EditorTabsComponent {
    files:Array;
    current;

    constructor(private filesService:FilesService) {
        this.filesService.openFiles$.subscribe(files => this.files = files);
        this.filesService.currentFile$.subscribe(file => this.current = file);
    }

    private click(event, file) {
        if (event.button === 0)
            this.select(file);
        else if (event.button === 1) {
            this.close(file);
        }
    }

    select(file) {
        this.filesService.openFile(file);
    }

    close(file) {
        this.filesService.closeFile(file);
    }
}