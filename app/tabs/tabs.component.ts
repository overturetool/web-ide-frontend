import {Component, Directive, Input, QueryList,
    ViewContainerRef, TemplateRef, ContentChildren} from 'angular2/core';
import {PaneComponent} from "./pane.component";
import {Output} from "angular2/core";
import {EventEmitter} from "angular2/core";

@Component({
    selector: 'tabs',
    templateUrl: 'app/tabs/tabs.component.html'
})
export class TabsComponent {
    @ContentChildren(PaneComponent) panes: QueryList<PaneComponent>;

    @Input() set selected(id) {
        this.panes.toArray().forEach(p => p.active = p.id == id);
    }
}