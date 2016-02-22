import {Component, Input} from "angular2/core"
import {NgIf} from "angular2/common";
import {HostBinding} from "angular2/core";

@Component({
    selector: "panel",
    template: '<div *ngIf="active" class="content"><ng-content></ng-content><div class="resizer"></div></div>',
    directives: [NgIf]
})
export class PanelComponent {
    @HostBinding("class.active") active:boolean = false;

    @Input() name: string;
}