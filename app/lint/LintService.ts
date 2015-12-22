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
    constructor(private server: ServerService) {
    }

    lint(text:string, callback:(data:[Marker])=>void):void {
        //this.server.get('lint').then(markers => callback(markers));
    }
}