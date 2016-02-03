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
export class WorkspaceService {
    selectedComponent;
    renamingComponent;
    renamingNode;
    movingNode;

    constructor(private filesService:FilesService) {
    }

    createFile(parent, name = "new-file") {
        var file = {
            name: name,
            type: "file",
            path: `${parent.path}/${name}`,
            parent: parent
        };

        parent.children.push(file);

        // TODO: Fix this hack-ish solution to trigger change detection.
        parent.children = parent.children.slice();

        this.filesService.createFile(file).subscribe();
    }

    createDirectory(parent, name = "new-directory") {
        var directory = {
            name: name,
            type: "directory",
            path: `${parent.path}/${name}`,
            children: [],
            parent: parent
        };

        parent.children.push(directory);

        // TODO: Fix this hack-ish solution to trigger change detection.
        parent.children = parent.children.slice();

        this.filesService.createDirectory(directory).subscribe();
    }

    createProject(parent, name = "new-project") {
        this.createDirectory(parent, name).subscribe();
    }

    startRename(component, node) {
        if (this.renamingComponent)
            this.renamingComponent.renaming = false;

        this.renamingComponent = component;
        this.renamingComponent.renaming = true;
        this.renamingNode = node;
    }

    renameTo(name) {
        this.filesService.renameFile(this.renamingNode, name)
            .subscribe(newName => {
                if (this.renamingNode.name === newName) return;

                // Update state in case of name collision
                this.renamingNode.name = newName;
                this.updatePath(this.renamingNode);
            });

        this.renamingNode.name = name;

        // Update path string of node and subtree
        this.updatePath(this.renamingNode);
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
        this.selectedComponent.active = true;
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
                this.updatePath(this.movingNode);
            });

        var oldParent = this.movingNode.parent;
        var newParent = target;

        // Remove from old position
        this.movingNode.parent.children.splice(this.movingNode.parent.children.indexOf(this.movingNode), 1);

        // Update state of moving file
        this.movingNode.parent = target; // Update parent reference
        this.updatePath(this.movingNode); // Update path string of node and subtree

        // Insert at new position
        target.children.push(this.movingNode);

        // TODO: Fix this hack-ish solution to trigger change detection.
        oldParent.children = oldParent.children.slice();
        newParent.children = newParent.children.slice();
    }

    private updatePath(node) {
        node.path = `${node.parent.path}/${node.name}`;

        if (node.children !== undefined)
            node.children.forEach(child => this.updatePath(child));
    }
}
