import {ElementRef} from "angular2/core";
import {NgZone} from "angular2/core";
import {Injectable} from "angular2/core";
import {Profile} from "./Profile";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/Rx";

declare var gapi;

declare type BasicProfile = {
    getId: () => string,
    getName: () => string,
    getFamilyName: () => string,
    getGivenName: () => string,
    getImageUrl: () => string,
    getEmail: () => string
}

declare type AuthResponse = {
    token_type: string,
    access_token: string,
    scope: string,
    login_hint: string,
    expires_in: number,
    id_token: string,
    session_state: { extraQueryParams: { authuser: string } },
    first_issued_at: number,
    expires_at: number,
    idpId: string
}

@Injectable()
export class AuthService {
    loggedin$:BehaviorSubject<boolean> = new BehaviorSubject(false);
    profile:Profile;
    accessToken:AuthResponse;

    private authInstance;

    constructor(private zone:NgZone) {
        gapi.load('auth2', () => {
            this.authInstance = gapi.auth2.init({
                client_id: '915544938368-etbmhsu4bk7illn6eriesf60v6q059kh.apps.googleusercontent.com'
            });
        });
    }

    signOut() {
        this.loggedin$.next(false);
        this.profile = null;
        this.accessToken = null;
        this.authInstance.signOut();
    }

    renderLoginButton(id:string) {
        gapi.signin2.render(id, {
            scope: "profile",
            width: 240,
            height: 50,
            longtitle: true,
            onsuccess: this.onSuccess.bind(this)
        });
    }

    private onSuccess(googleUser) {
        this.zone.run(() => {
            var basicProfile:BasicProfile = googleUser.getBasicProfile();
            var authResponse = googleUser.getAuthResponse();

            this.profile = new Profile(basicProfile.getId(), basicProfile.getName());
            this.accessToken = authResponse.access_token;

            this.loggedin$.next(true);
        });
    }
}