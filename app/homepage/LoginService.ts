import {ElementRef} from "angular2/core";
import {NgZone} from "angular2/core";
import {Injectable} from "angular2/core";

declare var gapi;

declare type Profile = {
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
export class LoginService {
    profile:Profile;
    authResponse:AuthResponse;

    private authInstance;

    constructor(private zone:NgZone) {

    }

    signOut() {
        this.profile = null;
        this.authResponse = null;
        this.authInstance.signOut();
    }

    render(id:string) {
        gapi.load('auth2', () => {
            this.authInstance = gapi.auth2.init({
                client_id: '915544938368-etbmhsu4bk7illn6eriesf60v6q059kh.apps.googleusercontent.com'
            });

            gapi.signin2.render(id, {
                scope: "profile",
                width: 240,
                height: 50,
                longtitle: true,
                onsuccess: this.onSuccess.bind(this)
            });
        });
    }

    private onSuccess(googleUser) {
        this.zone.run(() => {
            this.profile = googleUser.getBasicProfile();
            this.authResponse = googleUser.getAuthResponse();
        });
    }
}