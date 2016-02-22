import {Injectable} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {Subject} from "rxjs/Subject";
import {EditorService} from "../editor/EditorService";
import {ReplItem} from "./ReplItem";

@Injectable()
export class ReplService {
    items:Array<ReplItem> = [];

    constructor(private serverService:ServerService,
                private editorService:EditorService) {

    }

    evaluate(expression:string):void {
        var path = `eval/${btoa(expression)}`;
        var file = this.editorService.currentFile$.getValue();

        if (file !== null) path += `/${file.path}`;

        this.serverService.get(path)
            .map(res => res.text())
            .subscribe(result => this.items.push(new ReplItem(expression, result)));
    }
}