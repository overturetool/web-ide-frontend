import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService"
import {EventEmitter} from "angular2/core";
import {DbgpResponse} from "./DbgpResponse";
import {DbgpConnection} from "./DbgpConnection";

@Injectable()
export class DebugService {
    status:string = "stopped";
    context:Array<any> = [];
    stack:Array<any> = [];
    stdout:Array<string> = [];
    suspended:EventEmitter = new EventEmitter();

    private connection: DbgpConnection;
    private breakpoints = {};

    constructor(server:ServerService) {
        this.connection = new DbgpConnection(server);
        this.connection.messages.subscribe(res => this.onMessage(res));
    }

    connect(path:string, entry: string):void {
        this.connection.connect(path, entry);

        this.context = [];
        this.stack = [];
        this.stdout = [];
    }

    run():void {
        this.connection.send("run");
    }

    stop():void {
        this.connection.send('stop').then(() => this.connection.close());
    }

    stepInto():void {
        this.connection.send('step_into');
    }

    stepOver():void {
        this.connection.send('step_over');
    }

    stepOut():void {
        this.connection.send('step_out');
    }

    setBreakpoint(file, line):void {
        var fileRoot = "file:/home/rsreimer/speciale/web-api/workspace"; // TODO: Remove this

        if (!this.breakpoints[file]) this.breakpoints[file] = {};

        this.breakpoints[file][line] = null;

        if (this.status === "stopped") return;

        this.connection
            .send('breakpoint_set', `-t line -f ${fileRoot}/${file} -n ${line}`)
            .then(res =>
                this.breakpoints[file][line] = res);
    }

    removeBreakpoint(file, line):Promise {
        return this.connection.send('breakpoint_remove', `-d `);
    }

    getContext(depth:number = 0) {
        if (depth === 0)
            this.connection.send('context_get');
        //this.send('context_get', '-d 1');
    }

    getStack() {
        this.connection.send('stack_get');
        //this.send('context_get', '-d 1');
    }

    getStatus():Promise {
        return this.connection.send('status');
    }

    private onMessage(msg) {
        console.log(msg);

        if (msg.init || msg.stream)
            this.getStatus();

        if (msg.stream)
            this.stdout.push(msg.stream.keyValue);

        if (msg.response) {
            var response = msg.response;

            if (response.$status)
                this.status = response.$status;

            if (response.$status === "break") {
                this.getContext();
                this.getStack();
            } else {
                this.suspended.emit(null);
            }

            if (response.$command === "context_get")
                this.context = response.property;

            if (response.$command === "stack_get") {
                this.stack = response.stack.length ? response.stack : [response.stack];
                this.suspended.emit(this.stack[0].$lineno);
            }
        }
    }
}