import {bootstrap}    from "angular2/platform/browser"
import {HTTP_PROVIDERS} from "angular2/http"

import {IdeComponent} from './ide/ide.component'
import {LintService} from "./lint/LintService"
import {DebugService} from "./debug/DebugService"
import {ServerService} from "./server/ServerService"
import {SessionService} from "./auth/SessionService"
import {FilesService} from "./files/FilesService";
import {OutlineService} from "./outline/OutlineService";
import {HintService} from "./hint/HintService";

bootstrap(IdeComponent, [HTTP_PROVIDERS, HintService, LintService, DebugService, ServerService, SessionService, FilesService, OutlineService]);
