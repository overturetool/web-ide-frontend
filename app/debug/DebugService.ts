import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService"
import {EventEmitter} from "angular2/core";
import {DbgpResponse} from "./DbgpResponse";

@Injectable()
export class DebugService {
    private root: string = "debug";
    private fileRoot: string = "file:/home/rsreimer/speciale/web-api/workspace"; // TODO: Remove this
    private socket: WebSocket;
    private cmdCount:number = 0;

    public response = new EventEmitter();

    constructor(private server:ServerService) {
    }

    start(path:string, entry: string):void {
        this.socket = this.server.connect(`${this.root}/${path}?entry=${btoa(entry)}&type=vdmsl`);
        this.socket.addEventListener("message", e => this.onMessage(e.data));
    }

    private onMessage(msg):void {
        var xml = msg.substr(msg.indexOf('<?xml'));

        var response = new DbgpResponse(xml);

        this.response.emit(response.body);
    }

    private send(cmd:string, params:string = "") {
        this.cmdCount = (this.cmdCount + 1) % 10000;

        this.socket.send(`${cmd} -i ${this.cmdCount} ${params}`);
    }

    setBreakpoint(file, line):void {
        this.send('breakpoint_set', `-t line -f ${this.fileRoot}/${file} -n ${line}`);
    }

    removeBreakpoint(file, line):void {
    }

    run():void {
        this.send("run");
    }

    suspend():void {
        this.send("break");
    }

    stop():void {
        this.socket.close();
    }

    getContext() {
        return new Promise(resolve => {
            if (!this.options.includeGlobals) {
                this.connection
                    .sendCommand('context_get')
                    .then(response => resolve(response));
            } else {
                Promise.all([
                    this.connection.sendCommand('context_get'),
                    this.connection.sendCommand('context_get', '-c 1')
                ]).then(results => {
                    var combinedContext = {context: {}};

                    for (let i in results) {
                        for (let j in results[i].context) {
                            combinedContext.context[j] = results[i].context[j];
                        }
                    }

                    resolve(combinedContext);
                });
            }
        });
    }

    getSource(file, startLine, endLine) {
        var that = this;

        return new Promise(function (resolve, reject) {
            var parameters = '-f ' + file;

            if (startLine)
                parameters += ' -b ' + startLine;

            if (endLine)
                parameters += ' -e ' + endLine;

            that.connection.sendCommand('source', parameters).then(function (response) {
                resolve(response);
            });
        });
    }
}