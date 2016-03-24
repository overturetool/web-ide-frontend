import {Injectable} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {EditorService} from "../editor/EditorService";
import {ReplItem} from "./ReplItem";

@Injectable()
export class ReplService {
    items:Array<ReplItem> = [];

    constructor(private serverService:ServerService,
                private editorService:EditorService) {

    }

    evaluate(expression:string) {
        var path = `eval/${btoa(this._parse(expression))}`;
        var file = this.editorService.currentFile$.getValue();

        if (file !== null) path += `/${file.path}`;

        return this.serverService.get(path)
            .map(res => res.text())
            .do(result => this.items.push(new ReplItem(expression, result)));
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