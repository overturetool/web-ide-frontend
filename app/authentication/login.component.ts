import {Component, AfterViewInit, NgZone} from "angular2/core";
import {AuthenticationService} from "./AuthService";

declare var gapi;

@Component({
    selector: 'login',
    template: `
    <div class="wrapper">
        <h2>Please sign in:</h2>
        <div id="google-auth-button"></div>
    </div>`
})
export class LoginComponent implements AfterViewInit {
    constructor(private zone:NgZone,
                private authService:AuthenticationService) {

    }

    ngAfterViewInit() {
        // Google's sign in logic, as of Jan 2016, has a bug. It assumes that, after
        // the button has been rendered on the page, we never remove its container
        // from the page. It tries to change the "Sign in with Google" text to
        // "Signed in with Google", but that text is no longer on the screen,
        // and it causes a JS error.
        // See http://stackoverflow.com/q/34688248/249801 for more info.

        gapi.signin2.render("google-auth-button", {
            scope: "profile",
            width: 240,
            height: 50,
            longtitle: true,
            onsuccess: (googleUser) => {
                this.zone.run(() => {
                    this.authService.registerUser(googleUser);
                });
            }
        });
    }

    routerCanReuse() {
        return true;
    }
}