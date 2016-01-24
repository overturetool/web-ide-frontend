import {EditorTabsComponent} from "../editor/editor-tabs.component";
import {DebugComponent} from "../debug/debug.component";
import {FilesComponent} from "../files/files.component";
import {PanelComponent} from "../panel/panel.component";
import {PanelMenuComponent} from "../panel/panel-menu.component";
import {OutlineComponent} from "../outline/outline.component";
import {FilenamePipe} from "../files/filename.pipe";
import {FilesService} from "../files/FilesService";
import {OutlineService} from "../outline/OutlineService";
import {DebugService} from "../debug/DebugService";
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {HTTP_PROVIDERS} from "angular2/http";
import {Component} from "angular2/core";
import {EditorService} from "../editor/EditorService";
import {LintService} from "../lint/LintService";
import {HintService} from "../hint/HintService";

@Component({
    selector: 'ide',
    templateUrl: 'app/ide/ide.component.html',
    directives: [EditorTabsComponent, DebugComponent, FilesComponent, PanelComponent, PanelMenuComponent, OutlineComponent],
    pipes: [FilenamePipe],
    providers: [FilesService, LintService, HintService, EditorService, OutlineService, DebugService, ServerService, SessionService, HTTP_PROVIDERS]
})
export class IdeComponent {
}