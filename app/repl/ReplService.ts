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

    evaluate(expression:string):boolean {
        var parsed = this._parse(expression);
        if (parsed === "") return false;

        var path = `eval/${btoa(parsed)}`;
        var file = this.editorService.currentFile$.getValue();

        if (file !== null) path += `/${file.path}`;

        this.serverService.get(path)
            .map(res => res.text())
            .subscribe(result => this.items.push(new ReplItem(expression, result)));

        return true;
    }

    private _parse(expression:string):string {
        var last = this.items.length -1;

        return expression
            .replace(/\$\$/g, () => this.items[last].result)
            .replace(/\$(\d+)/g, (match, p1) => {
                var i = last - parseInt(p1);
                return i >= 0 ? this.items[i].result : "";
            });
    }
}