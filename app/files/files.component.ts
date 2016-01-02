declare var $;

import {ElementRef, Component, EventEmitter, Output} from "angular2/core"
import {FilesService} from "./FilesService"

@Component({
    selector: 'files',
    template: `<input type="search" (input)="search($event)" placeholder="Search"><div class="container"></div>`
})
export class FilesComponent {
    private $container;

    @Output() select = new EventEmitter();

    constructor(el:ElementRef, files:FilesService) {
        this.$container = $(el.nativeElement).find(".container").first();

        this.$container
            .on('activate_node.jstree', (e, data) => {
                if (data.node.original.type == "file")
                    this.select.emit(data.node.original.path);
            })
            .jstree({
                "state": {"key": "files"},
                "plugins": ["contextmenu", "dnd", "search", "sort", "state", "wholerow"],
                "core": {
                    "animation": false,
                    "check_callback": true
                },
                "search": {
                    "case_insensitive": true,
                    "show_only_matches" : true
                }
            });

        files.readDir("", 10)
            .then(dir => {
                this.$container.jstree(true).settings.core.data = this.dirToJsTree(dir);
                this.$container.jstree(true).refresh();
            });
    }

    dirToJsTree(dir) {
        return dir.map(file => {
            var node:any = {
                text: file.name,
                path: file.path,
                type: file.type,
                icon: file.type === "directory" ? "jstree-folder" : "jstree-file"
            };

            if (file.children)
                node.children = this.dirToJsTree(file.children);

            return node;
        });
    }

    search(event) {
        this.$container.jstree(true).search(event.target.value);
    }
}