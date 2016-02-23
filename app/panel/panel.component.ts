import {Component, Input} from "angular2/core"
import {NgIf} from "angular2/common";
import {HostBinding} from "angular2/core";

@Component({
    selector: "panel",
    templateUrl: 'app/panel/panel.component.html',
    directives: [NgIf]
})
export class PanelComponent {
    @HostBinding("class.active") active:boolean = false;

    @Input() name: string;
}