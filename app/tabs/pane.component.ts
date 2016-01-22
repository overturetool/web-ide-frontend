import {Input} from "angular2/core";
import {ViewContainerRef} from "angular2/core";
import {TemplateRef} from "angular2/core";
import {Component} from "angular2/core";

@Component({
    selector: 'pane',
    template: '<ng-content *ngIf="active"></ng-content>'
})
export class PaneComponent {
    @Input() name:string;
    active:boolean = false;
}