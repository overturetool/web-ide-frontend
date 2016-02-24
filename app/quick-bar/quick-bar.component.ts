import {Component, HostBinding, ViewChild, ElementRef} from "angular2/core";
import {WorkspaceService} from "../files/WorkspaceService";
import {Control} from "angular2/common";

declare var Fuse;

@Component({
    selector: "quick-bar",
    templateUrl: "app/quick-bar/quick-bar.component.html"
})
export class QuickBarComponent {
    @HostBinding("class.active") active:boolean = false;
    @ViewChild("input") inputElement:ElementRef;
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

    open() {
        this.active = true;
        setTimeout(() => this.inputElement.nativeElement.focus(), 0);

        var workspace = this.workspaceService.workspace$.getValue();
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