declare var $;

import {ElementRef, Component} from "angular2/core"
import {FilesService} from "./FilesService"

@Component({
    selector: 'files',
    template: `<input type="search" (input)="search($event)" placeholder="Search"><div class="container"></div>`
})
export class FilesComponent {
    private $container;

    constructor(el: ElementRef, files: FilesService) {
        this.$container = $(el.nativeElement).find(".container").first();

        this.$container.jstree({
            "state" : { "key" : "files" },
            "plugins" : ["contextmenu", "dnd", "search", "sort", "state", "wholerow"],
            "core" : {
                "animation": false,
                "check_callback": true,
                "data": [
                    { "text" : "Root node", "children" : [ { "text" : "Child node 1" }, { "text" : "Child node 2" } ] }
                ]
            }
        });
    }

    search(event) {
        this.$container.jstree(true)
            .search(event.target.value);
    }

    open() {

    }
}