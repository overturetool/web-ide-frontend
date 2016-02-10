import {Output, Injectable, EventEmitter} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {Observable} from "rxjs/Observable";
import {OnInit} from "angular2/core";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/Rx";
import {WorkspaceService} from "../files/WorkspaceService";
import {EditorService} from "../editor/EditorService";

@Injectable()
export class OutlineService {
    items$:Subject<Array<OutlineItem>> = new Subject();

    constructor(private serverService:ServerService,
                private editorService:EditorService) {
        this.editorService.currentFile$.subscribe(file => this.update(file));
        this.editorService.changes$.subscribe(file => this.update(file));
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

    highlight(section:EditorSection):void {
        this.editorService.highlight$.next(section);
    }

    focus(line:number):void {
        this.editorService.focus$.next(line);
    }
}