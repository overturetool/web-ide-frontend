import {Output, Injectable, EventEmitter} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {Observable} from "rxjs/Observable";
import {OnInit} from "angular2/core";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/Rx";
import {WorkspaceService} from "../files/WorkspaceService";
import {EditorService} from "../editor/EditorService";
import {OutlineItem} from "./OutlineItem";

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
                .map(items => this._mapItems(items))
                .subscribe(items => this.items$.next(items));
        }
    }

    createOutlineItem(name:string, type:string, location:EditorSection):OutlineItem {
        return new OutlineItem(name, type, location);
    }

    private _mapItems(items) {
        return items.map(item => {
            if (item.parameters && item.expectedResult)
                return this.createOutlineItem(
                    `${item.name}(${item.parameters.join(", ")})`,
                    `→ ${item.expectedResult}`,
                    item.location);

            if (item.expression)
                return this.createOutlineItem(item.name, item.type, item.location);

            return this.createOutlineItem(item.name, item.type, item.location);
        });
    }
}