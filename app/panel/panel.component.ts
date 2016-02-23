import {Component, Input} from "angular2/core"
import {HostBinding} from "angular2/core";

@Component({
    selector: "panel",
    templateUrl: 'app/panel/panel.component.html'
})
export class PanelComponent {
    @HostBinding("class.active") active:boolean = false;

    @Input() name: string;
}