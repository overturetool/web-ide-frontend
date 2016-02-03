import {Output, Injectable, EventEmitter} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {FilesService} from "../files/FilesService";
import {Observable} from "rxjs/Observable";
import {OnInit} from "angular2/core";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/Rx";

@Injectable()
export class ProofObligationsService {
    items$:Subject<Array<ProofObligationsItem>> = new Subject();
    highlight$:Subject<EditorSection> = new Subject();
    focus$:Subject<number> = new Subject();

    constructor(private serverService:ServerService) {

    }

    update(file) {
        if (!file) {
            this.items$.next([]);
        } else {
            this.serverService.get(`pog/${file.path}`)
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