import {Injectable} from "angular2/core";
import {ContextMenuComponent} from "./context-menu.component";

@Injectable()
export class ContextMenuService {
    lastMenu:ContextMenuComponent;

    constructor() {
        // TODO: Fix this hack. An Angular2 application should never reference the DOM directly.
        document.addEventListener('click', () => this.close());

        document.addEventListener('keyup', event => {
            if (event.keyCode === 27)
                this.close();
        });
    }

    public open(contextMenu:ContextMenuComponent) {
        this.close();
        this.lastMenu = contextMenu;
    }

    public close() {
        if (this.lastMenu) this.lastMenu.close();
    }
}