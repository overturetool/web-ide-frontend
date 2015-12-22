import {Component, View} from 'angular2/core'
import {EditorComponent} from "../editor/editor.component"
import {DebugComponent} from "../debug/debug.component"
import {FilesComponent} from "../files/files.component";
import {PanelComponent} from "../panel/panel.component";
import {PanelMenuComponent} from "../panel/panel-menu.component";

@Component({
    selector: 'ide',
    templateUrl: 'app/ide/ide.component.html',
    directives: [EditorComponent, DebugComponent, FilesComponent, PanelComponent, PanelMenuComponent]
})
export class IdeComponent {
    private left = "project";
    private right = "outline";

    toggleLeft(name) {
       this.left = this.left !== name ? name : '';
    }

    toggleRight(name) {
        this.right = this.right !== name ? name : '';
    }
}