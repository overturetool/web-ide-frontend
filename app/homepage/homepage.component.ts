import {Component} from "angular2/core";
import {OnInit} from "angular2/core";

declare var google;

@Component({
    selector: 'homepage',
    templateUrl: `app/homepage/homepage.component.html`
})
export class HomepageComponent implements OnInit {
    ngOnInit() {
        google.identitytoolkit.signInButton('#login-button-container', {
                widgetUrl: "http://localhost:3000/login",
                signOutUrl: "/"
            }
        );
    }
}