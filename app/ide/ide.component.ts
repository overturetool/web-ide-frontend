import {Component, View} from 'angular2/core'
import {DebugComponent} from "../debug/debug.component"
import {FilesComponent} from "../files/files.component";
import {PanelComponent} from "../panel/panel.component";
import {PanelMenuComponent} from "../panel/panel-menu.component";
import {OutlineComponent} from "../outline/outline.component";
import {IdeService} from "./IdeService";
import {EditorTabsComponent} from "../editor/editor-tabs.component";

@Component({
    selector: 'ide',
    templateUrl: 'app/ide/ide.component.html',
    directives: [EditorTabsComponent, DebugComponent, FilesComponent, PanelComponent, PanelMenuComponent, OutlineComponent]
})
export class IdeComponent {
    public file:string;

    constructor(private ideService: IdeService) {

    }
}