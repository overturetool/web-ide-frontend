import {Component} from 'angular2/core';
import {File} from "../files/File";
import "rxjs/add/operator/filter";
import {EditorService} from "./EditorService";

@Component({
    selector: 'editor-tabs',
    template: `
<div class="wrapper" *ngIf="files.length > 0">
    <ul>
        <li *ngFor="#file of files"
            [class.active]="file === current">
            <button (click)="click($event, file)">{{file.name}}</button><button (click)="close(file)" class="glyph close"></button>
        </li>
    </ul>
</div>`
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