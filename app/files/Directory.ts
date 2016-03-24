import {ServerService} from "../server/ServerService";
import {File} from "../files/File";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export class Directory {
    shouldRename:boolean = false;

    constructor(private serverService:ServerService,
                public parent:Directory,
                public name:string,
                public path:string,
                public children:Array<File|Directory>) {
    }

    findFile(path:Array<string>):File {
        var child = this.children.filter(child => child.name === path[0])[0];

        if (!child) return;

        return child instanceof File ? child : child.findFile(path.slice(1));
    }

    allFiles() {
        var files = [];

        this.children.forEach(child => {
            if (child instanceof Directory)
                files = files.concat(child.allFiles());
            else
                files.push(child);
        });

        return files;
    }

    close() {
        this.children.forEach(child => child.close());
    }

    deleteChild(node) {
        this.children.splice(this.children.indexOf(node), 1);

        // TODO: Fix this hack-ish solution to trigger change detection.
        this.children = this.children.slice();

        this.serverService.delete(`vfs/delete/${node.path}`).subscribe();
    }

    delete() {
        this.close();
        this.parent.deleteChild(this);
    }

    move(node):void {
        this.serverService.put(`vfs/move/${node.path}`, {
                destination: `${this.path}/${node.name}`.split("/").slice(1).join("/"),
                collisionPolicy: "KeepBoth"
            })
            .map(res => res.text())
            .subscribe(newName => {
                if (node.name === newName) return;

                // Update state in case of name collision
                node.name = newName;
                node.updatePath();
            });

        var oldParent = node.parent;

        // Remove from old position
        node.parent.children.splice(node.parent.children.indexOf(node), 1);

        // Update state
        node.parent = this;
        node.updatePath();

        // Insert at new position
        this.children.push(node);

        // TODO: Fix this hack-ish solution to trigger change detection.
        oldParent.children = oldParent.children.slice();
        this.children = this.children.slice();
    }

    rename(name:string):void {
        this.shouldRename = false;

        this.serverService.put(`vfs/move/${this.path}`, {
                destination: `${this.parent.path}/${name}`.split("/").slice(1).join("/"),
                collisionPolicy: "KeepBoth"
            })
            .map(res => res.text())
            .subscribe(newName => {
                if (this.name === newName) return;

                // Update state in case of name collision
                this.name = newName;
                this.updatePath();
            });

        this.name = name;

        // Update path string of node and subtree
        this.updatePath();
    }

    updatePath() {
        this.path = `${this.parent.path}/${this.name}`;

        this.children.forEach(child => child.updatePath());
    }
}
