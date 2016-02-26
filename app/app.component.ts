import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {LoginComponent} from "./auth/login.component";
import {LoggedInComponent} from "./auth/logged-in.component";
import {IdeComponent} from "./ide/ide.component";
import {HomepageComponent} from "./homepage/homepage.component";

@Component({
    selector: "app",
    templateUrl: `app/app.component.html`,
    providers: [ROUTER_PROVIDERS],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {
        path: '/',
        name: 'Homepage',
        component: HomepageComponent
    }
])
@RouteConfig([
    {
        path: '/login',
        name: 'Login',
        component: LoginComponent
    }
])
@RouteConfig([
    {
        path: '/logged-in',
        name: 'Logged-in',
        component: LoggedInComponent
    }
])
@RouteConfig([
    {
        path: '/ide',
        name: 'IDE',
        component: IdeComponent
    }
])
export class AppComponent {
}