import {Injectable, Input} from "angular2/core"
import {ServerService} from "../server/ServerService"

@Injectable()
export class DebugService {
    private root: string = "debug";
    private socket: WebSocket;

    constructor(private server:ServerService) {

    }

    start(path:string, entry: string):void {
        this.socket = this.server.connect(`${this.root}/${path}?entry=${btoa(entry)}`);
        this.socket.addEventListener("message", this.onMessage);
        this.socket.addEventListener("message", console.log);
    }

    private onMessage(event):void {

    }

    setBreakpoint(line):void {

    }

    removeBreakpoint(line):void {

    }

    run():void {

    }

    suspend():void {

    }

    stop():void {
        this.socket.close();
    }
}