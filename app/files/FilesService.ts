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
    root$:BehaviorSubject<Array> = new BehaviorSubject([]);
    openFiles$:BehaviorSubject<Array<string>> = new BehaviorSubject([]);
    currentFile$:BehaviorSubject<string> = new BehaviorSubject(null);

    constructor(private serverService:ServerService, private session:SessionService) {
        this._loadRoot();
    }

    writeFile(path:string, content:string) {
        return this.serverService.post(`vfs/${path}`, content);
    }

    readFile(path:string):Observable<string> {
        return this.serverService.get(`vfs/${path}`).map(res => res.text());
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
                this.currentFile$.next(openFiles[index-1]);
            else
                this.currentFile$.next(index+1 < openFiles.length ? openFiles[index+1] : null);
        }

        this.openFiles$.next(openFiles.filter(f => f !== file));
    }

    private _loadRoot():void {
        this.serverService
            .get(`vfs/${this.session.account}?depth=10`) // TODO: Should read whole tree and not just at a depth of 10
            .map(res => res.json())
            .subscribe(files => this.root$.next(files));
    }
}
