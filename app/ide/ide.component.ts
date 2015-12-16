import {Component, View} from 'angular2/core';
import {EditorComponent} from "../editor/editor.component";
import {PanelMenuComponent} from "../panel/panel-menu.component";
import {PanelComponent} from "../panel/panel.component";

@Component({
    selector: 'ide',
    templateUrl: 'app/ide/ide.component.html',
    directives: [EditorComponent, PanelMenuComponent, PanelComponent]
})
export class IdeComponent { }