declare var $;

import {ElementRef, Component} from "angular2/core"

@Component({
    selector: 'files',
    template: `<input type="search" (input)="search($event)" placeholder="find file"><div class="container"></div>`
})
export class FilesComponent {
    private $container;

    constructor(el: ElementRef) {
        this.$container = $(el.nativeElement).find(".container").first();

        this.$container.jstree({
            "state" : { "key" : "files" },
            "plugins" : ["contextmenu", "dnd", "search", "sort", "state"],
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
}