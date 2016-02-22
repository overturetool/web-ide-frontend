import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {BaseException} from "angular2/src/facade/exceptions";
import {BehaviorSubject} from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

export class Directory {
    parent:Directory;
    name:string;
    path:string;
    children:Array<File|Directory>;

    constructor(private serverService:ServerService) {
    }

    find(path:Array<string>):File|Directory {
        if (path.length === 0) return this;

        return this.children
            .filter(child => child.name === path[0])[0]
            .find(path.slice(1));
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
        this.serverService.put(`vfs/move/${node.path}`, {destination: `${this.path}/${node.name}`})
            .map(res => res.text())
            .subscribe(newName => {
                if (node.name === newName) return;

                // Update state in case of name collision
                node.name = newName;
                node._updatePath();
            });

        var oldParent = node.parent;

        // Remove from old position
        node.parent.children.splice(node.parent.children.indexOf(node), 1);

        // Update state
        node.parent = this;
        node._updatePath();

        // Insert at new position
        this.children.push(node);

        // TODO: Fix this hack-ish solution to trigger change detection.
        oldParent.children = oldParent.children.slice();
        this.children = this.children.slice();
    }

    rename(newName:string):void {
        this.serverService.put(`vfs/move/${this.path}`, {destination: `${this.parent.path}/${newName}`})
            .map(res => res.text())
            .subscribe(newName => {
                if (this.name === newName) return;

                // Update state in case of name collision
                this.name = newName;
                this._updatePath();
            });

        this.name = newName;

        // Update path string of node and subtree
        this._updatePath();
    }

    private _updatePath() {
        this.path = `${this.parent.path}/${this.name}`;

        this.children.forEach(child => child._updatePath());
    }
}