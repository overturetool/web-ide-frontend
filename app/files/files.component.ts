import {Input} from "angular2/core";
declare var $;

import {ElementRef, Component, EventEmitter, Output} from "angular2/core"
import {FilesService} from "./FilesService"

@Component({
    selector: 'files',
    template: `<input #searchInput type="search" (input)="search(searchInput.value)" placeholder="Search"><div class="container"></div>`
})
export class FilesComponent {
    private $container;
    private jstree;

    @Input() set files(files) {
        if (!files) return;

        var jstree = this.$container.jstree(true);
        jstree.settings.core.data = this.filesToJsTree(files);
        jstree.refresh();
    }

    @Output() select = new EventEmitter();

    constructor(el:ElementRef) {
        this.$container = $(el.nativeElement).find(".container").first();

        this.$container
            .on('activate_node.jstree', (e, data) => {
                if (data.node.type === "file")
                    this.select.emit(data.node.original.file.path);
            })
            .jstree({
                state: {key: "files"},
                plugins: ["contextmenu", "dnd", "search", "sort", "state", "wholerow", "types"],
                core: {
                    animation: false,
                    check_callback: true
                },
                types: {
                    directory: {
                        icon: "jstree-folder"
                    },
                    file: {
                        icon: "jstree-file",
                        valid_children: []
                    }
                },
                search: {
                    case_insensitive: true,
                    show_only_matches: true
                },
                contextmenu: {
                    items: this.contextMenu
                }
            });
    }

    search(event) {
        var jstree = this.$container.jstree(true);
        jstree.search(event.target.value);
    }

    private contextMenu(node) {
        var items = {
            "createFile": {
                label: "New File",
                action: data => {
                    var jstree = $.jstree.reference(data.reference);
                    var selected = jstree.get_selected();

                    if (!selected.length) return false;

                    var newNode = jstree.create_node(selected[0], {type: "file"});
                    jstree.edit(newNode);
                }
            },
            "createDirectory": {
                label: "New Directory",
                "separator_after": true,
                action: data => {
                    var jstree = $.jstree.reference(data.reference);
                    var selected = jstree.get_selected();

                    if (!selected.length) return false;

                    var node = jstree.create_node(selected[0], {type: "directory"});
                    jstree.edit(node);
                }
            },
            "rename": {
                label: "Rename",
                action: data => {
                    var jstree = $.jstree.reference(data.reference);
                    var node = jstree.get_node(data.reference);
                    jstree.edit(node);
                }
            },
            "delete": {
                label: "Delete",
                action: data => {
                    var jstree = $.jstree.reference(data.reference);
                    var selected = jstree.get_selected();
                    if (!selected.length) return false;

                    jstree.delete_node(selected);
                }
            }
        };

        if (node.type === "file") {
            delete items["createDirectory"];
            delete items["createFile"];
        }

        return items;
    }

    private filesToJsTree(dir) {
        return dir.map(file => {
            var node:any = {
                text: file.name,
                type: file.type,
                file: file
            };

            if (file.children)
                node.children = this.filesToJsTree(file.children);

            return node;
        });
    }
}