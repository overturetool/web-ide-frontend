import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService"
import {EventEmitter} from "angular2/core";
import {DbgpResponse} from "./DbgpResponse";
import {DbgpConnection} from "./DbgpConnection";

@Injectable()
export class DebugService {
    public connection: DbgpConnection;

    constructor(server:ServerService) {
        this.connection = new DbgpConnection(server);
    }

    connect(path:string, entry: string):void {
        this.connection.connect(path, entry);
    }

    run():void {
        this.connection.send("run");
    }

    stop():void {
        this.connection
            .send('stop')
            .then(() => this.connection.close());
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

    setBreakpoint(file, line):Promise {
        var fileRoot = "file:/home/rsreimer/speciale/web-api/workspace"; // TODO: Remove this
        return this.connection.send('breakpoint_set', `-t line -f ${fileRoot}/${file} -n ${line}`);
    }

    removeBreakpoint(file, line):void {
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
}