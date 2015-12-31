import {Injectable} from "angular2/core";
import {ServerService} from "../server/ServerService";

declare var CodeMirror;

@Injectable()
export class HintService {
    constructor(private server: ServerService) {
        this.hint.async = true;
    }

    hint(editor, callback, file) {
        var cur = editor.getCursor(),
            curLine = editor.getLine(cur.line),
            start = cur.ch,
            end = start +1;

        while (/[\w$]+/.test(curLine.charAt(start -1))) --start;
        while (/[\w$]+/.test(curLine.charAt(end))) ++end;

        this.server
            .get(`codecompletion/${file}?line=${cur.line}&column=${cur.ch}`)
            .then(res => {
                callback({
                    list: res.json().map(hint => hint.replacementString),
                    from: CodeMirror.Pos(cur.line, start),
                    to: CodeMirror.Pos(cur.line, end)
                });
            });
    }
}