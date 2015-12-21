declare var $;

import {ElementRef, Component} from "angular2/core"
import {FilesService} from "./FilesService"

@Component({
    selector: 'files',
    providers: [FilesService],
    template: `<input type="search" (input)="search($event)" placeholder="Search"><div class="container"></div>`
})
export class FilesComponent {
    private $container;

    constructor(el:ElementRef, files:FilesService) {
        this.$container = $(el.nativeElement).find(".container").first();

        this.$container.jstree({
            "state": {"key": "files"},
            "plugins": ["contextmenu", "dnd", "search", "sort", "state", "wholerow"],
            "core": {
                "animation": false,
                "check_callback": true
            }
        });

        files.readDir("", 10)
            .forEach(response => {
                this.$container.jstree(true).settings.core.data = this.dirToJsTree(response.json());
                this.$container.jstree(true).refresh();
            }, this);
    }

    dirToJsTree(dir) {
        return dir.map(file => {
            var node = {
                text: file.name,
                icon: file.type === "directory" ? "jstree-folder" : "jstree-file"
            };

            if (file.children)
                node.children = this.dirToJsTree(file.children);

            return node;
        });
    }

    search(event) {
        this.$container.jstree(true)
            .search(event.target.value);
    }

    open() {

    }
}