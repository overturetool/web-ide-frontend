import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService"
import {EventEmitter} from "angular2/core";
import {DbgpResponse} from "./DbgpResponse";
import {DbgpConnection} from "./DbgpConnection";

@Injectable()
export class DebugService {
    status:string = "";
    context:Array<any> = [];
    stack:Array<any> = [];
    stdout:Array<string> = [];
    breakpoints:Array = []; // TODO: Remove this breakpoint

    breakpointsChanged:EventEmitter = new EventEmitter();
    stackChanged:EventEmitter = new EventEmitter();

    private connection:DbgpConnection;

    constructor(server:ServerService) {
        this.connection = new DbgpConnection(server);
        this.connection.messages.subscribe(res => this.onMessage(res));
    }

    connect(path:string, entry:string):void {
        this.status = "";
        this.context = [];
        this.stack = [];
        this.stdout = [];

        this.connection.connect(path, entry)
            .then(() => this.syncBreakpoints());
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

    private syncBreakpoints() {
        var breakpoints = this.breakpoints.slice();
        this.breakpoints = [];

        breakpoints.forEach(bp => this.setBreakpoint(bp.file, bp.line));
        this.breakpointsChanged.emit(this.breakpoints);
    }

    setBreakpoint(file, line):void {
        var fileRoot = "file:/home/rsreimer/projects/speciale/web-api/workspace"; // TODO: Remove this

        if (this.connection.connected) {
            var self = this;

            this.connection
                .send('breakpoint_set', `-t line -f ${fileRoot}/${file} -n ${line}`)
                .then(res => {
                    if (!res.response.$id) return;

                    self.breakpoints.push({file: file, line: line, id: res.response.$id});
                    self.breakpointsChanged.emit(self.breakpoints);
                });
        } else {
            this.breakpoints.push({file: file, line: line});
            this.breakpointsChanged.emit(this.breakpoints);
        }
    }

    removeBreakpoint(file, line):void {
        var breakpoint = this.breakpoints.filter(bp => bp.file === file && bp.line === line)[0];

        if (this.connection.connected)
            this.connection.send('breakpoint_remove', `-d ${breakpoint.id}`);

        this.breakpoints = this.breakpoints.filter(bp => bp.file !== file || bp.line !== line);
        this.breakpointsChanged.emit(this.breakpoints);
    }

    getContext():void {
        this.connection
            .send('context_names')
            .then(response => {
                this.context = [];

                response.response.context
                    .reverse()
                    .forEach(context => this.connection
                        .send('context_get', `-c ${context.$id}`)
                        .then(res => this.context.push({
                            $name: context.$name,
                            property: res.response.property
                        }))
                    );
            });
    }

    getStack():void {
        var self = this;

        this.connection.send('stack_get')
            .then(response => {
                self.stack = response.response.stack.length ? response.response.stack : [response.response.stack];

                // TODO: Remove this mapping
                self.stack = self.stack.map(frame => {
                    frame.$filename = frame.$filename.replace("file:/home/rsreimer/projects/speciale/web-api/workspace", '');
                    return frame;
                });

                self.stackChanged.emit(self.stack);
            });
    }

    getStatus():void {
        this.connection.send('status');
    }

    private onMessage(msg) {
        if (msg.init || msg.stream)
            this.getStatus();

        if (msg.stream)
            this.stdout.push(msg.stream.keyValue);

        if (msg.response) {
            var status = msg.response.$status;

            if (!status) return;

            this.status = status;

            if (status === "break") {
                this.getContext();
                this.getStack();
            } else {
                this.stackChanged.emit([]);
            }
        }
    }
}