import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService"
import {EventEmitter} from "angular2/core";
import {DbgpResponse} from "./DbgpResponse";

@Injectable()
export class DbgpConnection {
    private root:string = "debug";
    private socket:WebSocket;
    private cmdCount:number = 0;
    private requests:Array<any> = [];

    public messages = new EventEmitter();

    constructor(private server:ServerService) {
    }

    connect(path:string, entry:string):void {
        this.close();

        this.socket = this.server.connect(`${this.root}/${path}?entry=${btoa(entry)}&type=vdmsl`);
        this.socket.addEventListener("message", e => this.onMessage(e.data));
    }

    private onMessage(msg):void {
        var xml = msg.substr(msg.indexOf('<?xml'));

        var response = new DbgpResponse(xml);

        this.messages.emit(response.body);

        if (response.body.response) {
            var id = response.body.response.$id;

            if (id && this.requests[id]) {
                this.requests[id](response.body);
                this.requests[id] = undefined;
            }
        }
    }

    public send(cmd:string, params:string = ""):Promise {
        this.cmdCount = (this.cmdCount + 1) % 10000;

        this.socket.send(`${cmd} -i ${this.cmdCount} ${params}`);

        return new Promise(resolve => this.requests[this.cmdCount] = resolve);
    }

    close():void {
        if (this.socket) this.socket.close();
        this.messages.emit({ response: { $status: "stopped" } });
    }
}