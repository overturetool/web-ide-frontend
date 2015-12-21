import {bootstrap}    from 'angular2/platform/browser'
import {IdeComponent} from './ide/ide.component'
import {LintService} from "./lint/LintService"
import {DebugService} from "./debug/DebugService"
import {ServerService} from "./server/ServerService"
import {SessionService} from "./auth/SessionService"
import {HTTP_PROVIDERS} from "angular2/http"

bootstrap(IdeComponent, [HTTP_PROVIDERS, LintService, DebugService, ServerService, SessionService]);
