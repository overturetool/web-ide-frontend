import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {IdeComponent} from "./ide/ide.component";
import {HomepageComponent} from "./homepage/homepage.component";
import {ServerService} from "./server/ServerService";
import {HTTP_PROVIDERS} from "angular2/http";
import {LoginService} from "./homepage/LoginService";

@Component({
    selector: "app",
    templateUrl: `app/app.component.html`,
    providers: [HTTP_PROVIDERS, ROUTER_PROVIDERS, ServerService, LoginService],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {
        path: '/',
        name: 'Homepage',
        component: HomepageComponent
    },
    {
        path: '/ide',
        name: 'IDE',
        component: IdeComponent
    }
])
export class AppComponent {

}