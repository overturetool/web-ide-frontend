import {Component} from "angular2/core";
import {AuthService} from "../auth/AuthService";

@Component({
    selector: "menu",
    templateUrl: "app/menu/menu.component.html"
})
export class MenuComponent {
    constructor(private authService:AuthService) {

    }
}