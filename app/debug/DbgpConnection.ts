import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService"
import {EventEmitter} from "angular2/core";
import {DbgpResponse} from "./DbgpResponse";

@Injectable()
export class DbgpConnection {
    private socket:WebSocket;
    private cmdCount:number = 0;
    private requests:Array<any> = [];

    public connecting: boolean = false;
    public connected: boolean = false;
    public messages = new EventEmitter();

    constructor(private server:ServerService) {
    }

    connect(file, entry:string):Promise<Object> {
        this.close();

        var [workspace, project] = file.path.split('/');

        this.socket = this.server.connect(`debug/${workspace}/${project}?entry=${btoa(entry)}&type=vdmsl`);
        this.socket.addEventListener("message", e => this.onMessage(e.data));
        this.socket.addEventListener("close", e => this.onClose());

        this.connecting = true;

        return new Promise(resolve => {
            this.socket.addEventListener("open", () => {
                this.connected = true;
                this.connecting = false;
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