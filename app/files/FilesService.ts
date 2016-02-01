import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {BaseException} from "angular2/src/facade/exceptions";
import {BehaviorSubject} from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";

@Injectable()
export class FilesService {
    projects$:BehaviorSubject<Array> = new BehaviorSubject([]);
    openFiles$:BehaviorSubject<Array<string>> = new BehaviorSubject([]);
    currentFile$:BehaviorSubject<string> = new BehaviorSubject(null);
    movingFile;
    selectedFile;

    constructor(private serverService:ServerService, private session:SessionService) {
        this.loadProjects();
    }

    writeFile(path:string, content:string) {
        return this.serverService.post(`vfs/writeFile/${path}`, content);
    }

    readFile(path:string):Observable<string> {
        return this.serverService.get(`vfs/readFile/${path}`).map(res => res.text());
    }

    openFile(file:string):void {
        var openFiles = this.openFiles$.getValue();
        if (openFiles.indexOf(file) === -1)
            this.openFiles$.next([...openFiles, file]);

        var currentFile = this.currentFile$.getValue();
        if (currentFile !== file)
            this.currentFile$.next(file);
    }

    closeFile(file:string):void {
        var openFiles = this.openFiles$.getValue();

        if (this.currentFile$.getValue() === file) {
            var index = openFiles.indexOf(file);

            if (index > 0)
                this.currentFile$.next(openFiles[index - 1]);
            else
                this.currentFile$.next(index + 1 < openFiles.length ? openFiles[index + 1] : null);
        }

        this.openFiles$.next(openFiles.filter(f => f !== file));
    }

    deleteFile(file) {
        if (file.type === "file") this.closeFile(file.path);

        // Remove from file tree
        if (file.parent) {
            var oldParent = file.parent;
            file.parent.children.splice(file.parent.children.indexOf(file), 1);
            oldParent.children = oldParent.children.slice(); // TODO: Fix this hack-ish solution to trigger change detection.
        }

        this.serverService.delete(`vfs/delete/${file.path}`).subscribe();
    }

    renameFile(file) {
        // TODO
        return this.serverService.put(`vfs/rename/${file.path}`);
    }

    registerMove(file) {
        this.movingFile = file;
    }

    selectFile(file) {
        if (this.selectedFile) this.selectedFile.active = false;

        this.selectedFile = file;
        file.active = true;
    }

    moveFileTo(target):void {
        this.serverService.put(`vfs/move/${this.movingFile.path}`, {destination: target.path})
            //.map(res => res.json()) TODO: Remove this comment
            .subscribe(newName => {
                return; // TODO: Remove this.
                if (this.movingFile.name === newName) return;

                // Update state in case of name collision
                this.movingFile.name = newName;
                this._updatePath(this.movingFile);
            });

        var oldParent = this.movingFile.parent;
        var newParent = target;

        // Remove from old position
        this.movingFile.parent.children.splice(this.movingFile.parent.children.indexOf(this.movingFile), 1);

        // Update state of moving file
        this.movingFile.parent = target; // Update parent reference
        this._updatePath(this.movingFile); // Update path string of node and subtree

        // Insert at new position
        target.children.push(this.movingFile);

        // TODO: Fix this hack-ish solution to trigger change detection.
        oldParent.children = oldParent.children.slice();
        newParent.children = newParent.children.slice();
    }

    loadProjects():void {
        this.serverService
            .get(`vfs/readdir/${this.session.account}?depth=-1`)
            .map(res => res.json())
            .map(projects => this._setParents(projects))
            .subscribe(projects => this.projects$.next(projects));
    }

    private _setParents(nodes) {
        return nodes.map(node => {
            if (node.children !== undefined) {
                node.children.forEach(child => child.parent = node);
                this._setParents(node.children);
            }

            return node;
        });
    }

    private _updatePath(node) {
        node.path = `${node.parent.path}/${node.name}`;

        if (node.children !== undefined)
            node.children.forEach(child => this._updatePath(child));
    }
}
