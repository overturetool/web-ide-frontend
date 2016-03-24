import {ContextMenuService} from "./ContextMenuService";
import {Component, HostBinding, ElementRef} from "angular2/core";

@Component({
    selector: "context-menu",
    template: `<ng-content *ngIf="opened"></ng-content>`
})
export class ContextMenuComponent {
    @HostBinding("class.open")
    opened:boolean = false;

    constructor(private contextMenuService:ContextMenuService,
                private element:ElementRef) {

    }

    open(event) {
        event.preventDefault();

        this.element.nativeElement.style.left = `${event.clientX}px`;
        this.element.nativeElement.style.top = `${event.clientY}px`;

        this.contextMenuService.open(this);
        this.opened = true;
    }

    close() {
        this.opened = false;
    }
}