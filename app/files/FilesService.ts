import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {BaseException} from "angular2/src/facade/exceptions";
import {BehaviorSubject} from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FilesService {
    root$:BehaviorSubject<Array> = new BehaviorSubject([]);
    openFiles$:BehaviorSubject<Array<string>> = new BehaviorSubject([]);
    currentFile$:BehaviorSubject<string> = new BehaviorSubject(null);

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
        var openFiles = this.openFiles$.getValue();
        if (openFiles.indexOf(file) === -1)
            this.openFiles$.next([...openFiles, file]);

        var currentFile = this.currentFile$.getValue();
        if (currentFile !== file)
            this.currentFile$.next(file);
    }

    closeFile(file:string):void {
        var openFiles = this.openFiles$.getValue();

        if (openFiles.indexOf(file) === -1) return;

        this.openFiles$.next(openFiles.filter(f => f !== file));
    }

    private _loadRoot() {
        this.serverService
            .get(`vfs/${this.session.account}?depth=10`) // TODO: Should read whole tree and not just at a depth of 10
            .map(res => res.json())
            .subscribe(files => this.root$.next(files));
    }
}
