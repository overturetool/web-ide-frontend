import {Injectable} from "angular2/core";

@Injectable()
export class ContextMenuService {
    public isOpen:boolean = false;
    public menu:Array = [];

    public open(menu:Array) {
        this.isOpen = true;
        this.menu = menu;
    }

    public close() {
        this.isOpen = false;
    }

    private click(event, item) {
        if (event.button === 0)
            item.action();

        this.close();
    }
}