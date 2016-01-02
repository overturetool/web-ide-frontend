import {Component, Input} from "angular2/core"
import {NgIf} from "angular2/common";

@Component({
    selector: "panel",
    template: '<div *ngIf="active" class="content"><ng-content></ng-content></div>',
    directives: [NgIf]
})
export class PanelComponent {
    @Input() name: string;
    @Input() active:boolean = false;
}