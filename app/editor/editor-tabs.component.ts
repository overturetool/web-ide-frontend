import {Component, Directive, Input, QueryList,
    ViewContainerRef, TemplateRef, ContentChildren} from 'angular2/core';
import {Output} from "angular2/core";
import {EventEmitter} from "angular2/core";
import {FilesService} from "../files/FilesService";
import {EditorComponent} from "./editor.component";
import {FilenamePipe} from "../files/filename.pipe";
import {OnInit} from "angular2/core";

@Component({
    selector: 'editor-tabs',
    templateUrl: 'app/editor/editor-tabs.component.html',
    directives: [EditorComponent],
    pipes: [FilenamePipe]
})
export class EditorTabsComponent {
    files:Array<string>;
    current:string;

    constructor(private filesService:FilesService) {
        this.filesService.openFiles$.subscribe(files => this.files = files);
        this.filesService.currentFile$.subscribe(file => this.current = file);
    }

    select(file: string) {
        this.filesService.openFile(file);
    }

    close(file: string) {
        this.filesService.closeFile(file);
    }
}