import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {BaseException} from "angular2/src/facade/exceptions";
import {BehaviorSubject} from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FilesService {
    root:Array<any> = [];
    openFiles:Array<string> = [];
    currentFile:string;

    root$:BehaviorSubject<Array> = new BehaviorSubject(this.root);
    openFiles$:BehaviorSubject<Array<string>> = new BehaviorSubject(this.openFiles);
    currentFile$:BehaviorSubject<string> = new BehaviorSubject(this.currentFile);

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
        if (this.openFiles.indexOf(file) === -1) {
            this.openFiles.push(file);
            this.openFiles$.next(this.openFiles);
        }

        if (this.currentFile !== file) {
            this.currentFile = file;
            this.currentFile$.next(this.currentFile);
        }
    }

    closeFile(file:string):void {
        var index = this.openFiles.indexOf(file);
        if (index === -1) return;

        this.openFiles.splice(index, 1);
        this.openFiles$.next(this.openFiles);
    }

    private _loadRoot() {
        this.serverService
            .get(`vfs/${this.session.account}?depth=10`) // TODO: Should read whole tree and not just at a depth of 10
            .map(res => res.json())
            .subscribe(files => {
                this.root = files;
                this.root$.next(files);
            });
    }
}
