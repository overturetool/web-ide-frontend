import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {BaseException} from "angular2/src/facade/exceptions";
import {BehaviorSubject} from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Directory} from "./Directory";
import {ReplaySubject} from "rxjs/Rx";
import {EditorService} from "../editor/EditorService";

export class File {
    parent:Directory;
    name:string;
    path:string;
    document = null;
    content$ = new BehaviorSubject(null);

    constructor(private serverService:ServerService,
                private editorService:EditorService) {
    }

    find(path:Array<string>):File {
        return this;
    }

    load():void {
        this.serverService.get(`vfs/readFile/${this.path}`)
            .map(res => res.text())
            .subscribe(content => this.content$.next(content));
    }

    write(content:string):void {
        this.content$.next(content);
        this.serverService.post(`vfs/writeFile/${this.path}`, content).subscribe();
    }

    open():void {
        if (this.content$.getValue() === null)
            this.load();

        this.editorService.openFile(this);
    }

    close():void {
        this.editorService.closeFile(this);
    }

    delete():void {
        this.close();
        this.parent.deleteChild(this);
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
    }
}
