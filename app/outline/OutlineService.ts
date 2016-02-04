import {Output, Injectable, EventEmitter} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {Observable} from "rxjs/Observable";
import {OnInit} from "angular2/core";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/Rx";
import {WorkspaceService} from "../files/WorkspaceService";

@Injectable()
export class OutlineService {
    items$:Subject<Array<OutlineItem>> = new Subject();
    highlight$:Subject<EditorSection> = new Subject();
    focus$:Subject<number> = new Subject();

    constructor(private serverService:ServerService,
                private workspaceService:WorkspaceService) {
        this.workspaceService.currentFile$.subscribe(file => this.update(file));
    }

    update(file) {
        if (!file) {
            this.items$.next([]);
        } else {
            this.serverService.get(`outline/${file.path}`)
                .map(res => res.json())
                .subscribe(items => this.items$.next(items));
        }
    }

    highlight(item:EditorSection):void {
        this.highlight$.next(item);
    }

    focus(line:number):void {
        this.focus$.next(line);
    }
}