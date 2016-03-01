import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
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
    document = null;
    content$:Subject<string> = new Subject();

    constructor(private serverService:ServerService,
                private editorService:EditorService,
                public parent:Directory,
                public name:string,
                public path:string) {

        // TODO: Load file content on demand instead.
        this.load().subscribe();
    }

    save(content:string):Observable {
        this.content$.next(content);
        return this.serverService.post(`vfs/writeFile/${this.path}`, content);
    }

    load():Observable {
        return this.serverService.get(`vfs/readFile/${this.path}`)
            .map(res => res.text())
            .do(content => this.document = CodeMirror.Doc(content, "vdm"));
    }

    open():void {
        if (this.document === null) {
            this.load()
                .subscribe(() => this.editorService.loadFile(this));
        } else {
            this.editorService.loadFile(this);
        }
    }

    close():void {
        this.editorService.closeFile(this);
    }

    delete():void {
        this.close();
        this.parent.deleteChild(this);
    }

    rename(name:string):void {
        this.serverService.put(`vfs/move/${this.path}`, {destination: `${this.parent.path}/${name}`})
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
    }
}
