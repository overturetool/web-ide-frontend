import {Input} from "angular2/core";
import {ViewContainerRef} from "angular2/core";
import {TemplateRef} from "angular2/core";
import {Component} from "angular2/core";
import {HostBinding} from "angular2/core";

@Component({
    selector: 'pane',
    template: '<ng-content></ng-content>'
})
export class PaneComponent {
    @Input() name:string;
    @Input() id:any;
    @Input() @HostBinding('class.active') active:boolean = false;
}