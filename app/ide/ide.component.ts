import {EditorTabsComponent} from "../editor/editor-tabs.component";
import {DebugComponent} from "../debug/debug.component";
import {PanelComponent} from "../panel/panel.component";
import {PanelMenuComponent} from "../panel/panel-menu.component";
import {OutlineComponent} from "../outline/outline.component";
import {ContextMenuService} from "../contextmenu/ContextMenuService";
import {LintService} from "../lint/LintService";
import {HintService} from "../hint/HintService";
import {OutlineService} from "../outline/OutlineService";
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
import {ReplComponent} from "../repl/repl.component";
import {ReplService} from "../repl/ReplService";
import {GuideComponent} from "../guide/guide.component";
import {RightResizerComponent} from "../panel/right-resizer.component";
import {LeftResizerComponent} from "../panel/left-resizer.component";
import {TopResizerComponent} from "../panel/top-resizer.component";
import {QuickBarComponent} from "../quick-bar/quick-bar.component";

@Component({
    selector: 'ide',
    templateUrl: 'app/ide/ide.component.html',
    directives: [GuideComponent, RightResizerComponent, LeftResizerComponent, TopResizerComponent, QuickBarComponent, ProofObligationsComponent, ReplComponent, EditorTabsComponent, EditorComponent, DebugComponent, WorkspaceComponent, PanelComponent, PanelMenuComponent, OutlineComponent],
    providers: [ProofObligationsService, ReplService, ContextMenuService, WorkspaceService, LintService, HintService, OutlineService, ServerService, SessionService, EditorService, WorkspaceFactory, HTTP_PROVIDERS]
})
export class IdeComponent {
    empty: boolean = true;

    constructor(editorService:EditorService) {
        editorService.currentFile$.subscribe(file => this.empty = !file);
    }
}