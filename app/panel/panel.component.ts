import {Component} from "angular2/core"

@Component({
    selector: "panel",
    inputs: ['name'],
    styleUrls: ['app/panel/panel.component.css'],
    template: `<button (click)="toggle()">{{ name }}</button><div [class.active]="open" class="content"><ng-content></ng-content></div>`
})
export class PanelComponent {
    open:boolean = false;

    toggle():void {
        this.open = !this.open;
    }
}