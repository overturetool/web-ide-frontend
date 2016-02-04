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

@Injectable()
export class WorkspaceService {
    workspace$:Subject = new Subject();
    openFiles$:BehaviorSubject<Array> = new BehaviorSubject([]);
    currentFile$:BehaviorSubject = new BehaviorSubject(null);

    selectedComponent;
    renamingComponent;
    renamingNode;
    movingNode;

    constructor(private serverService:ServerService,
                private sessionService:SessionService) {

        this._loadWorkspace();
    }

    openFile(file):void {
        var openFiles = this.openFiles$.getValue();
        if (openFiles.indexOf(file) === -1)
            this.openFiles$.next([...openFiles, file]);

        var currentFile = this.currentFile$.getValue();
        if (currentFile !== file)
            this.currentFile$.next(file);
    }

    closeFile(file):void {
        var openFiles = this.openFiles$.getValue();

        if (this.currentFile$.getValue() === file) {
            var index = openFiles.indexOf(file);

            if (index > 0)
            // Open file to the left
                this.currentFile$.next(openFiles[index - 1]);
            else
            // Open file to the right or no file
                this.currentFile$.next(index + 1 < openFiles.length ? openFiles[index + 1] : null);
        }

        this.openFiles$.next(openFiles.filter(f => f !== file));
    }

    newFile(parent, name = "new-file") {
        var file = this.createFile(parent, name, `${parent.path}/${name}`);

        // TODO: Fix this hack-ish solution to trigger change detection.
        parent.children = parent.children.slice();

        // TODO: Use naming collision response
        this.serverService.post(`vfs/mkFile/${file.path}`, null).subscribe();
    }

    newDirectory(parent, name = "new-directory") {
        var directory = this.createDirectory(parent, name, `${parent.path}/${name}`);

        // TODO: Fix this hack-ish solution to trigger change detection.
        parent.children = parent.children.slice();

        // TODO: Use naming collision response
        this.serverService.post(`vfs/mkdir/${directory.path}`, null).subscribe();
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

    createFile(parent:Directory, name:string, path:string, content:string = ""):File {
        var file = new File(this.serverService, this);

        file.parent = parent;
        file.name = name;
        file.path = path;
        file.content = content;

        parent.children.push(file);

        return file;
    }

    createDirectory(parent:Directory, name:string, path:string, children:Array<File|Directory> = []):Directory {
        var directory = new Directory(this.serverService);

        directory.parent = parent;
        directory.name = name;
        directory.path = path;
        directory.children = children;

        if (parent)
            parent.children.push(directory);

        return directory;
    }

    private _loadWorkspace():void {
        this.serverService
            .get(`vfs/readdir/${this.sessionService.account}?depth=-1`)
            .map(res => res.json())
            .map(projects => this.createDirectory(
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
                    return this.createFile(node, child.name, child.path);
                }

                if (child.type === "directory") {
                    var directory = this.createDirectory(
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
