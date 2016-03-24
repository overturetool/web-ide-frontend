import {Component} from "angular2/core";
import {HTTP_PROVIDERS} from "angular2/http";
import {ServerService} from "./server/ServerService";
import {RouteConfig} from "angular2/router";
import {ROUTER_PROVIDERS} from "angular2/router";
import {ROUTER_DIRECTIVES} from "angular2/router";
import {IdeComponent} from "./ide/ide.component";
import {AuthenticationService} from "./authentication/AuthService";
import {LoginComponent} from "./authentication/login.component";

@Component({
    selector: "app",
    template: "<router-outlet></router-outlet>",
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS, HTTP_PROVIDERS, ServerService, AuthenticationService]
})
@RouteConfig([
    {path: '/ide', name: 'Ide', component: IdeComponent},
    {path: '/', name: 'Login', component: LoginComponent, useAsDefault: true}
])
export class AppComponent {

}