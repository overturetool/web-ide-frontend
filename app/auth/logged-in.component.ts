import {Component} from "angular2/core";
import {Router} from "angular2/router";

@Component({
    selector: "logged-in",
    template: ``
})
export class LoggedInComponent {
    constructor() {
        var values = {};

        location.hash.slice(1).split("&")
            .map(value => value.split("="))
            .forEach(value => values[value[0]] = value[1]);
    }
}