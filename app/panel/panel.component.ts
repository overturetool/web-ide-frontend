import {Component, ElementRef} from "angular2/core"

@Component({
    selector: "panel",
    template: `<ng-content></ng-content>`
})
export class PanelComponent {
}