import {Component} from "angular2/core";
import {AuthService} from "./AuthService";
import {AfterViewInit} from "angular2/core";

@Component({
    selector: 'login',
    templateUrl: "app/auth/login.component.html"
})
export class LoginComponent implements AfterViewInit {
    constructor(private authService:AuthService) {

    }

    ngAfterViewInit() {
        this.authService.renderLoginButton("google-auth-button");
    }
}