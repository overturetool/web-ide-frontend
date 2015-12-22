import {Component, QueryList, ContentChildren} from "angular2/core"
import {PanelComponent} from "./panel.component"

@Component({
    selector: 'panel-menu',
    templateUrl: "app/panel/panel-menu.component.html"
})
export class PanelMenuComponent {
    @ContentChildren(PanelComponent) panels: QueryList<PanelComponent>;

    select(panel: PanelComponent) {
        this.panels.toArray().forEach((p: PanelComponent) => p.active = p === panel ? !p.active : false);
    }
}