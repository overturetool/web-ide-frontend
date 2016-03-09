import {Component, QueryList, ContentChildren} from "angular2/core"
import {PanelComponent} from "./panel.component"
import {Output} from "angular2/core";
import {EventEmitter} from "angular2/core";

@Component({
    selector: 'panel-menu',
    templateUrl: "app/panel/panel-menu.component.html"
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