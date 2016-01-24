import {Output, Injectable, EventEmitter} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {FilesService} from "../files/FilesService";
import {Observable} from "rxjs/Observable";
import {OnInit} from "angular2/core";
import {Subject} from "rxjs/Subject";

@Injectable()
export class OutlineService {
    items$:Observable<Array<OutlineItem>>;
    highlight$:Subject<EditorSection>;
    focus$:Subject<number>;

    constructor(private serverService:ServerService,
                private filesService:FilesService) {
        // Find outline items in current file
        this.items$ = this.filesService.currentFile$
            .filter(file => file)
            .flatMap(file => this.serverService.get(`outline/${file}`))
            .map(res => res.json());

        this.highlight$ = new Subject();
        this.focus$ = new Subject();
    }

    highlight(item:EditorSection):void {
        this.highlight$.next(item);
    }

    focus(line:number):void {
        this.focus$.next(line);
    }
}