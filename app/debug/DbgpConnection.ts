import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService"
import {EventEmitter} from "angular2/core";
import {DbgpResponse} from "./DbgpResponse";

@Injectable()
export class DbgpConnection {
    private socket:WebSocket;
    private cmdCount:number = 0;
    private requests:Array<any> = [];

    public connected: boolean = false;
    public messages = new EventEmitter();

    constructor(private server:ServerService) {
    }

    connect(path:string, entry:string):Promise<Object> {
        this.close();

        var pathParts = path.split('/');

        var workspace = pathParts[0];
        var project = pathParts[1];

        this.socket = this.server.connect(`debug/${workspace}/${project}?entry=${btoa(entry)}&type=vdmsl`);
        this.socket.addEventListener("message", e => this.onMessage(e.data));
        this.socket.addEventListener("close", e => this.onClose());

        return new Promise(resolve => {
            this.socket.addEventListener("open", () => {
                this.connected = true;
                resolve();
            })
        });
    }

    onClose():void {
        this.connected = false;
    }

    private onMessage(msg):void {
        var xml = msg.substr(msg.indexOf('<?xml'));

        var response = new DbgpResponse(xml);

        this.messages.emit(response.body);

        if (response.body.response) {
            var res = response.body.response;

            if (res.$status === "stopped") this.close();

            var id = res.$transaction_id;

            if (id && this.requests[id]) {
                this.requests[id](response.body);
                this.requests[id] = undefined;
            }
        }
    }

    public send(cmd:string, params:string = ""):Promise<Object> {
        this.cmdCount = (this.cmdCount + 1) % 10000;

        this.socket.send(`${cmd} -i ${this.cmdCount} ${params}`);

        return new Promise(resolve => this.requests[this.cmdCount] = resolve);
    }

    close():void {
        if (this.socket)
            this.socket.close();
    }
}