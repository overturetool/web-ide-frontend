import {ElementRef} from "angular2/core";
import {NgZone} from "angular2/core";
import {Injectable} from "angular2/core";
import {Profile} from "./Profile";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/Rx";
import {ServerService} from "../server/ServerService";
import {Router} from "angular2/router";

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
    profile:Profile;
    signedIn:boolean = false;

    constructor(private router:Router,
                private serverService:ServerService) {
    }

    forceSignIn() {
        this.router.navigate(["Login"]);
    }

    signOut() {
        Promise.all([
            this.serverService.get('signout').toPromise(),
            gapi.auth2.getAuthInstance().signOut()
        ]).then(() => {
            this.signedIn = false;
            this.forceSignIn()
        });
    }

    registerUser(googleUser) {
        var basicProfile:BasicProfile = googleUser.getBasicProfile();
        var authResponse:AuthResponse = googleUser.getAuthResponse();

        this.serverService.registerAccessToken(authResponse.access_token);

        this.serverService
            .get(`verify?tokenId=${authResponse.id_token}`)
            .subscribe(() => {
                this.profile = new Profile(basicProfile.getId(), basicProfile.getName());

                this.signedIn = true;
                this.router.navigate(["Ide"]);
            });
    }
}