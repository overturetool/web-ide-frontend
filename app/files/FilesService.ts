import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {BaseException} from "angular2/src/facade/exceptions";
import {BehaviorSubject} from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FilesService {
    private _root:Array<any> = [];
    private _open:Array<string> = [];
    private _current:string;

    root:BehaviorSubject<Array> = new BehaviorSubject(this._root);
    openFiles:BehaviorSubject<Array<string>> = new BehaviorSubject(this._open);
    currentFile:BehaviorSubject<string> = new BehaviorSubject(this._current);

    constructor(private serverService:ServerService, private session:SessionService) {
        this._loadRoot();
    }

    writeFile(path:string, content:string):void {
        this.serverService.post(`vfs/${path}`, content);
    }

    readFile(path:string) {
        return this.serverService.get(`vfs/${path}`).map(res => res.text()).toPromise();
    }

    openFile(file:string):void {
        if (this._open.indexOf(file) === -1) {
            this._open.push(file);
            this.openFiles.next(this._open);
        }

        this._current = file;
        this.currentFile.next(file);
    }

    closeFile(file:string):void {
        var index = this._open.indexOf(file);
        if (index === -1) return;

        this._open.splice(index, 1);
        this.openFiles.next(this._open);
    }

    private _loadRoot() {
        this.serverService
            .get(`vfs/${this.session.account}?depth=10`) // TODO: Should read whole tree and not just at a depth of 10
            .map(res => res.json())
            .subscribe(files => {
                this._root = files;
                this.root.next(files);
            });
    }
}
