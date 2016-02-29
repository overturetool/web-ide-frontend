import {Component} from "angular2/core";
import {OnInit} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {LoginService} from "./LoginService";
import {ElementRef} from "angular2/core";

@Component({
    selector: 'homepage',
    templateUrl: `app/homepage/homepage.component.html`
})
export class HomepageComponent implements OnInit {
    constructor(private loginService:LoginService) {

    }

    ngOnInit() {
        this.loginService.render("google-auth-container");
    }

    signOut() {
        this.loginService.signOut();
    }
}