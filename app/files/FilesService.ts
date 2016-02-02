import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {BaseException} from "angular2/src/facade/exceptions";
import {BehaviorSubject} from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class FilesService {
    workspace$:Subject = new Subject();
    openFiles$:BehaviorSubject<Array> = new BehaviorSubject([]);
    currentFile$:BehaviorSubject = new BehaviorSubject(null);

    constructor(private serverService:ServerService, private session:SessionService) {
        this.loadWorkspace();
    }

    writeFile(file, content:string):void {
        this.serverService.post(`vfs/writeFile/${file.path}`, content).subscribe();
    }

    readFile(file):Observable<string> {
        return this.serverService.get(`vfs/readFile/${file.path}`).map(res => res.text());
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

    deleteFile(file) {
        if (file.type === "file")
            this.closeFile(file);

        this.serverService.delete(`vfs/delete/${file.path}`).subscribe();
    }

    moveFile(file, target):Observable {
        return this.serverService.put(`vfs/move/${file.path}`, {destination: `${target.path}/${file.name}`})
            .map(res => res.text());
    }

    renameFile(file, newName) {
        return this.serverService.put(`vfs/move/${file.path}`, {destination:`${file.parent.path}/${newName}`})
            .map(res => res.text());
    }

    createFile(file) {
        return this.serverService.post(`vfs/mkFile/${file.path}`, null)
            .map(res => res.text());
    }

    createDirectory(directory) {
        return this.serverService.post(`vfs/mkdir/${directory.path}`, null)
            .map(res => res.text());
    }

    loadWorkspace():void {
        this.serverService
            .get(`vfs/readdir/${this.session.account}?depth=-1`)
            .map(res => res.json())
            .map(projects => {
                return {
                    name: this.session.account,
                    path: this.session.account,
                    children: projects
                };
            })
            .map(workspace => this.setParentRefs(workspace))
            .subscribe(workspace => this.workspace$.next(workspace));
    }

    private setParentRefs(node) {
        if (node.children !== undefined) {
            node.children.forEach(child => {
                child.parent = node;
                this.setParentRefs(child);
            });
        }

        return node;
    }
}
