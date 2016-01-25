import {Injectable} from "angular2/core";
import {ServerService} from "../server/ServerService";

declare var CodeMirror;

@Injectable()
export class HintService {
    constructor(private serverService:ServerService) {
        this.hint.async = true;
    }

    hint(editor, callback, file) {
        var cur = editor.getCursor(),
            lineText = editor.getLine(cur.line),
            start = cur.ch,
            end = start + 1;

        while (/[\w$]+/.test(lineText.charAt(start - 1))) --start;
        while (/[\w$]+/.test(lineText.charAt(end))) ++end;

        this.serverService
            .get(`codecompletion/${file}?line=${cur.line}&column=${cur.ch}`)
            .map(res => res.json().map(hint => hint.replacementString))
            .subscribe(hints => callback({
                list: hints,
                from: CodeMirror.Pos(cur.line, start),
                to: CodeMirror.Pos(cur.line, end)
            }));
    }
}