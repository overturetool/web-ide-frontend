import {Component, HostBinding, ViewChild, ElementRef} from "angular2/core";
import {WorkspaceService} from "../files/WorkspaceService";
import {Control} from "angular2/common";
import {File} from "../files/File";
import {PathPipe} from "../files/path.pipe";

declare var Fuse;

@Component({
    selector: "quick-bar",
    templateUrl: "app/quick-bar/quick-bar.component.html",
    pipes: [PathPipe]
})
export class QuickBarComponent {
    @ViewChild("input") inputElement:ElementRef;
    active:boolean = false;
    expression:string = "";
    files:Array<File> = [];
    selected:number = 0;
    fuse;

    constructor(private workspaceService:WorkspaceService) {
        document.addEventListener('keyup', this.onDocKeyup.bind(this));
        document.addEventListener('keydown', this.onDocKeydown.bind(this));
    }

    onDocKeydown(event:KeyboardEvent) {
        // Ctrl + P
        if (event.ctrlKey && event.keyCode === 80)
            event.preventDefault();
    }

    onDocKeyup(event:KeyboardEvent):void {
        // Ctrl + P
        if (event.ctrlKey && event.keyCode === 80)
            this.open();

        // Escape
        if (event.keyCode === 27)
            this.close();
    }

    onKeyup(event:KeyboardEvent) {
        // Enter
        if (event.keyCode === 13)
            this.openFile(this.files[this.selected]);

        // Escape
        if (event.keyCode === 27) {
            event.preventDefault();
            this.close();
        }

        // Keyup
        if (event.keyCode === 38) {
            event.preventDefault();
            this.selected = this.selected === 0 ? this.selected = this.files.length -1 : this.selected -1;
        }

        // Keydown
        if (event.keyCode === 40) {
            event.preventDefault();
            this.selected = (this.selected +1) % this.files.length;
        }
    }

    onChange(value:string) {
        this.selected = 0;
        this.files = this.fuse.search(value);
    }

    select(i:number):void {
        this.selected = i;
    }

    open() {
        var workspace = this.workspaceService.workspace$.getValue();
        if (!workspace) return;

        this.select(0);
        this.active = true;
        setTimeout(() => this.inputElement.nativeElement.focus(), 0);

        this.files = workspace.allFiles();
        this.fuse = new Fuse(this.files, {keys: ["path"]});
    }

    close() {
        this.active = false;
        this.expression = "";
    }

    openFile(file:File) {
        if (!file) return;

        file.open();
        this.close();
    }
}