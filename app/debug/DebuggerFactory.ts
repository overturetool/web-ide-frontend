import {ServerService} from "../server/ServerService";
import {Injectable} from "angular2/core";
import {DbgpDebugger} from "./DbgpDebugger";

@Injectable()
export class DebuggerFactory {
    constructor(private serverService:ServerService) {

    }

    createDebugger():DbgpDebugger {
        return new DbgpDebugger(this.serverService);
    }
}