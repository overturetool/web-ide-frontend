import {Component, View} from 'angular2/core'
import {DebugComponent} from "../debug/debug.component"
import {FilesComponent} from "../files/files.component";
import {PanelComponent} from "../panel/panel.component";
import {PanelMenuComponent} from "../panel/panel-menu.component";
import {OutlineComponent} from "../outline/outline.component";
import {FilesService} from "../files/FilesService";
import {TabsComponent} from "../tabs/tabs.component";
import {EditorComponent} from "../editor/editor.component";
import {PaneComponent} from "../tabs/pane.component";
import {FilenamePipe} from "../files/filename.pipe";

@Component({
    selector: 'ide',
    templateUrl: 'app/ide/ide.component.html',
    directives: [TabsComponent, PaneComponent, EditorComponent, DebugComponent, FilesComponent, PanelComponent, PanelMenuComponent, OutlineComponent],
    pipes: [FilenamePipe],
    providers: [FilesService]
})
export class IdeComponent {
}