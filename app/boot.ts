import {bootstrap}    from 'angular2/platform/browser'
import {IdeComponent} from './ide/ide.component'
import {LintService} from "./lint/LintService";
import {DebugService} from "./debug/DebugService";
import {ServerService} from "./server/ServerService";

bootstrap(IdeComponent, [LintService, DebugService, ServerService]);
