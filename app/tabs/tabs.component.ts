import {Component, Directive, Input, QueryList,
    ViewContainerRef, TemplateRef, ContentChildren} from 'angular2/core';
import {PaneComponent} from "./pane.component";

@Component({
    selector: 'tabs',
    templateUrl: 'app/tabs/tabs.component.html'
})
export class TabsComponent {
    @ContentChildren(PaneComponent) panes: QueryList<PaneComponent>;

    select(pane: PaneComponent) {
        this.panes.toArray().forEach(p => p.active = p == pane);
    }
}