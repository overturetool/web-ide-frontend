import {bootstrap}    from "angular2/platform/browser"
import {HTTP_PROVIDERS} from "angular2/http"

import {IdeComponent} from './ide/ide.component'
import {LintService} from "./lint/LintService"
import {DebugService} from "./debug/DebugService"
import {ServerService} from "./server/ServerService"
import {SessionService} from "./auth/SessionService"


bootstrap(IdeComponent, [HTTP_PROVIDERS, LintService, DebugService, ServerService, SessionService]);
