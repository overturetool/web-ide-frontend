import {Output, Injectable, EventEmitter} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {FilesService} from "../files/FilesService";
import {Observable} from "rxjs/Observable";
import {OnInit} from "angular2/core";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/Rx";

@Injectable()
export class OutlineService {
    items$:BehaviorSubject<Array<OutlineItem>> = new BehaviorSubject([]);
    highlight$:Subject<EditorSection>;
    focus$:Subject<number>;

    constructor(private serverService:ServerService,
                private filesService:FilesService) {
        this.highlight$ = new Subject();
        this.focus$ = new Subject();
    }

    update() {
        // Find outline items in current file
        var file = this.filesService.currentFile$.getValue();
        this.serverService.get(`outline/${file}`)
            .map(res => res.json())
            .subscribe(items => this.items$.next(items));
    }

    highlight(item:EditorSection):void {
        this.highlight$.next(item);
    }

    focus(line:number):void {
        this.focus$.next(line);
    }
}