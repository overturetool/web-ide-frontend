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

export class LintService {
    private server;

    constructor() {
        this.server = ServerService;
    }

    lint(text:string, callback:(data:[Marker])=>void):void {
        this.server.emit('linter/lint');
        this.server.once('linter/linted', markers => callback(markers));
    }
}