import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {BaseException} from "angular2/src/facade/exceptions";
import {BehaviorSubject} from "rxjs/subject/BehaviorSubject";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";
import {Directory} from "./Directory";
import {File} from "./File";
import {DebugService} from "../debug/DebugService";
import {EditorService} from "../editor/EditorService";
import {WorkspaceFactory} from "./WorkspaceFactory";

@Injectable()
export class WorkspaceService {
    workspace$:BehaviorSubject = new BehaviorSubject(null);

    selectedComponent;
    renamingComponent;
    renamingNode;
    movingNode;

    constructor(private serverService:ServerService,
                private sessionService:SessionService,
                private workspaceFactory:WorkspaceFactory) {

        this._loadWorkspace();
    }

    newFile(parent, name = "new-file") {
        var file = this.workspaceFactory.createFile(parent, name, `${parent.path}/${name}`);

        // TODO: Fix this hack-ish solution to trigger change detection.
        parent.children = parent.children.slice();

        this.serverService.post(`vfs/mkFile/${file.path}`, null)
            .map(res => res.text())
            .subscribe(newName => {
                if (newName === name) return;

                file.name = newName;
                file.updatePath();
            });
    }

    newDirectory(parent, name = "new-directory") {
        var directory = this.workspaceFactory.createDirectory(parent, name, `${parent.path}/${name}`);

        // TODO: Fix this hack-ish solution to trigger change detection.
        parent.children = parent.children.slice();

        this.serverService.post(`vfs/mkdir/${directory.path}`, null)
            .map(res => res.text())
            .subscribe(newName => {
                if (newName === name) return;

                directory.name = newName;
                directory.updatePath();
            });
    }

    newProject(parent, name = "new-project") {
        this.newDirectory(parent, name);
    }

    startRename(component, node) {
        if (this.renamingComponent)
            this.renamingComponent.renaming = false;

        this.renamingComponent = component;
        this.renamingComponent.renaming = true;
        this.renamingNode = node;
    }

    startMove(node) {
        this.movingNode = node;
    }

    select(component) {
        if (this.selectedComponent)
            this.selectedComponent.active = false;

        this.selectedComponent = component;
        this.selectedComponent.active = true;
    }

    private _loadWorkspace():void {
        this.serverService
            .get(`vfs/readdir/${this.sessionService.account}?depth=-1`)
            .map(res => res.json())
            .map(projects => this.workspaceFactory.createDirectory(
                null,
                this.sessionService.account,
                this.sessionService.account,
                projects))
            .map(workspace => this._mapChildren(workspace))
            .subscribe(workspace => {
                this.workspace$.next(workspace);
            });
    }

    private _mapChildren(node) {
        node.children = node.children
            .map(child => {
                if (child.type === "file") {
                    return this.workspaceFactory.createFile(node, child.name, child.path);
                }

                if (child.type === "directory") {
                    var directory = this.workspaceFactory.createDirectory(
                        node,
                        child.name,
                        child.path,
                        child.children
                    );

                    return this._mapChildren(directory);
                }
            });

        return node;
    }
}
