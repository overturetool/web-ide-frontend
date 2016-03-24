import {Component, Input, HostBinding} from "angular2/core";

@Component({
    selector: "panel",
    template: `
<div class="wrapper">
    <div class="header">{{name}}</div>
    <ng-content></ng-content>
</div>`
})
export class PanelComponent {
    @HostBinding("class.active") active:boolean = false;

    @Input() name: string;
}