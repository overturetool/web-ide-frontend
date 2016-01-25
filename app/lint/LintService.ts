import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService"

declare type Marker = {
    from: {
        line: number,
        ch: number
    },
    to: {
        line: number,
        ch: number
    },
    message: string,
    severity: string
}

@Injectable()
export class LintService {
    private root:string = "lint";

    constructor(private server: ServerService) {
    }

    lint(file:string, callback:(data:[Marker])=>void):void {
        if (!file) {
            callback([]);
        }
        else {
            this.server.get(`${this.root}/${file}`)
                .map(res => res.json())
                .subscribe(result => {
                    var markers = [].concat(
                        this._result2markers(result.parserErrors, "error"),
                        this._result2markers(result.parserWarnings, "warning"),
                        this._result2markers(result.typeCheckerErrors, "error"),
                        this._result2markers(result.typeCheckerWarnings, "warning")
                    );

                    callback(markers);
                });
        }
    }

    private _result2markers(result, severity) {
        return result.map(note => {
            return {
                from: {
                    line: note.location.startLine -1,
                    ch: note.location.startPos -1
                },
                to: {
                    line: note.location.endLine -1,
                    ch: note.location.endPos -1
                },
                message: note.message,
                severity: severity
            }
        })

    }
}