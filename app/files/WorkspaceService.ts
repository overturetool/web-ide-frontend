import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {BaseException} from "angular2/src/facade/exceptions";
import {BehaviorSubject} from "rxjs/subject/BehaviorSubject";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";
import {Directory} from "./Directory";
import {File} from "./File";
import {EditorService} from "../editor/EditorService";
import {WorkspaceFactory} from "./WorkspaceFactory";
import {AuthService} from "../auth/AuthService";
import {OnInit} from "angular2/core";

@Injectable()
export class WorkspaceService {
    workspace$:BehaviorSubject<Directory> = new BehaviorSubject(null);

    selectedComponent;
    renamingComponent;
    renamingNode;
    movingNode;

    constructor(private serverService:ServerService,
                private authService:AuthService,
                private workspaceFactory:WorkspaceFactory) {

    }

    newFile(parent, name = "new-file") {
        var file = this.workspaceFactory.createFile(parent, name, `${parent.path}/${name}`);
        file.shouldRename = true;

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
        directory.shouldRename = true;

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

    newProject(name = "new-project") {
        var parent = this.workspace$.getValue();
        var project = this.workspaceFactory.createProject(parent, name, `${parent.path}/${name}`);
        project.shouldRename = true;

        // TODO: Fix this hack-ish solution to trigger change detection.
        parent.children = parent.children.slice();

        this.serverService.post(`vfs/mkdir/${project.path}`, null)
            .map(res => res.text())
            .subscribe(newName => {
                if (newName === name) return;

                project.name = newName;
                project.updatePath();
            });
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

    loadProject(name:string):void {
        var workspace = this.workspace$.getValue();
        var path = `${workspace.path}/${name}`;

        this.serverService
            .get(`vfs/readdir/${path}?depth=-1`)
            .map(res => res.json())
            .subscribe(children => {
                var project = this.workspaceFactory.createProject(workspace, name, path, children);
                this._mapChildren(project);
                this.workspace$.next(workspace);
            });
    }

    loadWorkspace():void {
        this.serverService
            .get(`vfs/readdir/${this.authService.profile.id}?depth=-1`)
            .map(res => res.json())
            .map(projects => this.workspaceFactory.createDirectory(
                null,
                this.authService.profile.id,
                this.authService.profile.id,
                projects))
            .map(workspace => this._mapChildren(workspace))
            .subscribe(workspace => this.workspace$.next(workspace));
    }

    private _mapChildren(node) {
        node.children = node.children
            .map(child => {
                // File
                if (child.type === "file") {
                    return this.workspaceFactory.createFile(node, child.name, child.path);
                }

                // Project
                else if (child.path.split("/").length === 2) {
                    var project = this.workspaceFactory.createProject(
                        node,
                        child.name,
                        child.path,
                        child.children
                    );

                    return this._mapChildren(project);
                }

                // Directory
                else if (child.type === "directory") {
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
