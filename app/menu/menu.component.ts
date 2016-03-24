import {Component} from "angular2/core";
import {AuthService} from "../auth/AuthenticationService";
import {ElementRef} from "angular2/core";
import {WorkspaceService} from "../files/WorkspaceService";
import {ExamplesService} from "../files/ExamplesService";

@Component({
    selector: "menu",
    templateUrl: "app/menu/menu.component.html"
})
export class MenuComponent {
    current:string;
    active:boolean = false;

    constructor(private authService:AuthService,
                private workspaceService:WorkspaceService,
                private examplesService:ExamplesService) {
        document.addEventListener('click', event => {
            if (!event.target.matches('menu .open > button'))
                this.close();
        });
    }

    open(name:string):void {
        this.active = true;
        this.current = name;
    }

    close():void {
        this.active = false;
        this.current = null;
    }

    private onClick(name:string):void {
        if (this.current !== name)
            this.open(name);
        else
            this.close();
    }

    private onMouseEnter(name:string):void {
        if (this.active)
            this.open(name);
    }
}