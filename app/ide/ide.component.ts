import {EditorTabsComponent} from "../editor/editor-tabs.component";
import {DebugComponent} from "../debug/debug.component";
import {ProjectTreesComponent} from "../files/project-trees.component";
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
import {LintService} from "../lint/LintService";
import {HintService} from "../hint/HintService";

@Component({
    selector: 'ide',
    templateUrl: 'app/ide/ide.component.html',
    directives: [EditorTabsComponent, DebugComponent, ProjectTreesComponent, PanelComponent, PanelMenuComponent, OutlineComponent],
    pipes: [FilenamePipe],
    providers: [FilesService, LintService, HintService, OutlineService, DebugService, ServerService, SessionService, HTTP_PROVIDERS]
})
export class IdeComponent {
}