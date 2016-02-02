import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {BaseException} from "angular2/src/facade/exceptions";
import {BehaviorSubject} from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";
import {FilesService} from "./FilesService";

@Injectable()
export class ProjectTreesService {
    selectedComponent;
    renamingComponent;
    movingNode;

    constructor(private filesService:FilesService) {
    }

    startRename(component) {
        if (this.renamingComponent)
            this.renamingComponent.renaming = false;

        this.renamingComponent = component;
    }

    renameTo(name) {

    }

    delete(node) {
        // Remove node from tree
        if (node.parent) {
            var oldParent = node.parent;
            node.parent.children.splice(node.parent.children.indexOf(node), 1);

            // TODO: Fix this hack-ish solution to trigger change detection.
            oldParent.children = oldParent.children.slice();
        }

        this.filesService.deleteFile(node);
    }

    select(component) {
        if (this.selectedComponent)
            this.selectedComponent.active = false;

        this.selectedComponent = component;
        component.active = true;
    }

    startMove(node) {
        this.movingNode = node;
    }

    moveTo(target):void {
        this.filesService.moveFile(this.movingNode, target)
            .subscribe(newName => {
                if (this.movingNode.name === newName) return;

                // Update state in case of name collision
                this.movingNode.name = newName;
                this._updatePath(this.movingNode);
            });

        var oldParent = this.movingNode.parent;
        var newParent = target;

        // Remove from old position
        this.movingNode.parent.children.splice(this.movingNode.parent.children.indexOf(this.movingNode), 1);

        // Update state of moving file
        this.movingNode.parent = target; // Update parent reference
        this._updatePath(this.movingNode); // Update path string of node and subtree

        // Insert at new position
        target.children.push(this.movingNode);

        // TODO: Fix this hack-ish solution to trigger change detection.
        oldParent.children = oldParent.children.slice();
        newParent.children = newParent.children.slice();
    }

    private _updatePath(node) {
        node.path = `${node.parent.path}/${node.name}`;

        if (node.children !== undefined)
            node.children.forEach(child => this._updatePath(child));
    }
}
