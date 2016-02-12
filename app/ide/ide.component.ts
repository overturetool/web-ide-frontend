import {EditorTabsComponent} from "../editor/editor-tabs.component";
import {DebugComponent} from "../debug/debug.component";
import {PanelComponent} from "../panel/panel.component";
import {PanelMenuComponent} from "../panel/panel-menu.component";
import {OutlineComponent} from "../outline/outline.component";
import {ContextMenuService} from "../contextmenu/ContextMenuService";
import {LintService} from "../lint/LintService";
import {HintService} from "../hint/HintService";
import {OutlineService} from "../outline/OutlineService";
import {DebugService} from "../debug/DebugService";
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {HTTP_PROVIDERS} from "angular2/http";
import {Component} from "angular2/core";
import {WorkspaceComponent} from "../files/workspace.component";
import {ProofObligationsComponent} from "../proof-obligations/proof-obligations.component";
import {ProofObligationsService} from "../proof-obligations/ProofObligationsService";
import {WorkspaceService} from "../files/WorkspaceService";
import {WorkspaceFactory} from "../files/WorkspaceFactory";
import {EditorService} from "../editor/EditorService";
import {EditorComponent} from "../editor/editor.component";

@Component({
    selector: 'ide',
    templateUrl: 'app/ide/ide.component.html',
    directives: [ProofObligationsComponent, EditorTabsComponent, EditorComponent, DebugComponent, WorkspaceComponent, PanelComponent, PanelMenuComponent, OutlineComponent],
    providers: [ProofObligationsService, ContextMenuService, WorkspaceService, LintService, HintService, OutlineService, DebugService, ServerService, SessionService, EditorService, WorkspaceFactory, HTTP_PROVIDERS]
})
export class IdeComponent {
}