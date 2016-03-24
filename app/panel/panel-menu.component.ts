import {Component, QueryList, ContentChildren, Output, EventEmitter} from "angular2/core"
import {PanelComponent} from "./panel.component"

@Component({
    selector: 'panel-menu',
    template: `
<ng-content></ng-content>
<div class="wrapper">
    <div class="menu">
        <button *ngFor="#panel of panels"
                (click)="select(panel)"
                [class.active]="panel.active">
            {{panel.name}}
        </button>
    </div>
</div>`
})
export class PanelMenuComponent {
    @Output() change:EventEmitter = new EventEmitter();
    @ContentChildren(PanelComponent) panels: QueryList<PanelComponent>;

    select(panel: PanelComponent) {
        this.panels.toArray().forEach((p: PanelComponent) => {
            if (p === panel) {
                p.active = !p.active;
                this.change.emit(p.active ? p : null);
            } else {
                p.active = false;
            }
        });

    }
}