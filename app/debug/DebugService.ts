import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService"
import {BehaviorSubject} from "rxjs/subject/BehaviorSubject";
import {DbgpResponse} from "./DbgpResponse";
import {DbgpConnection} from "./DbgpConnection";
import {Breakpoint} from "./Breakpoint";
import {StackFrame} from "./StackFrame";
import {File} from "../files/File";
import {WorkspaceService} from "../files/WorkspaceService";
import {EditorService} from "../editor/EditorService";

@Injectable()
export class DebugService {
    status:string = "";
    context:Array<any> = [];
    stack:Array<StackFrame> = [];
    currentFrame:StackFrame;
    stdout:Array<string> = [];
    breakpoints:Array<any> = [];

    breakpointsChanged:BehaviorSubject<Array> = new BehaviorSubject([]);
    stackChanged:BehaviorSubject<Array<StackFrame>> = new BehaviorSubject([]);

    private connection:DbgpConnection;

    constructor(serverService:ServerService,
                private editorService:EditorService,
                private workspaceService:WorkspaceService) {
        this.connection = new DbgpConnection(serverService);
        this.connection.messages.subscribe(res => this.onMessage(res));
    }

    connect(file, entry:string):void {
        this.status = "";
        this.context = [];
        this.stack = [];
        this.stdout = [];

        this.connection.connect(file, entry)
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
        this.breakpointsChanged.next(this.breakpoints);
    }

    setBreakpoint(file:File, line:number):void {
        if (this.connection.connected) {
            var self = this;

            this.connection
                .send('breakpoint_set', `-t line -f ${file.path} -n ${line}`)
                .then(res => {
                    if (!res.response.$id) return;

                    var breakpoint = self.createBreakpoint(file, line);
                    breakpoint.id = res.response.$id;

                    self.breakpoints.push(breakpoint);
                    self.breakpointsChanged.next(self.breakpoints);
                });
        } else {
            this.breakpoints.push(this.createBreakpoint(file, line));
            this.breakpointsChanged.next(this.breakpoints);
        }
    }

    removeBreakpoint(file, line):void {
        var breakpoint = this.breakpoints.filter(bp => bp.file === file && bp.line === line)[0];

        if (this.connection.connected)
            this.connection.send('breakpoint_remove', `-d ${breakpoint.id}`);

        this.breakpoints = this.breakpoints.filter(bp => bp.file !== file || bp.line !== line);
        this.breakpointsChanged.next(this.breakpoints);
    }

    getContext(frame?: StackFrame):void {
        this.currentFrame = frame;
        var level = frame ? frame.level : 0;

        this.connection
            .send('context_names')
            .then(response => {
                this.context = [];

                response.response.context
                    .reverse()
                    .forEach(context => this.connection
                        .send('context_get', `-d ${level} -c ${context.$id}`)
                        .then(res => {
                            if (context.$name == "GLOBAL") {
                                this.context.push({ $name: "Global", property: res.response.property });
                            }

                            if (context.$name == "LOCAL") {
                                this.context = this.context.concat(res.response.property);
                            }
                        })
                    );
            });
    }

    getStack():void {
        var self = this;

        this.connection.send('stack_get')
            .then(response => {
                var stack = response.response.stack.length ? response.response.stack : [response.response.stack];

                self.stack = stack.map(frame => {
                    var file = this.workspaceService.workspace$.getValue().find(frame.$filename.split("/").slice(1));
                    var char = parseInt(frame.$cmdbegin.split(":")[1]);

                    return this.createStackFrame(frame.$level, file, frame.$lineno, char);
                });

                this.currentFrame = self.stack[0];
                self.stack[0].file.open();
                this.editorService.focus(self.stack[0].line);

                self.stackChanged.next(self.stack);
            });
    }

    getStatus():void {
        this.connection.send('status');
    }

    createBreakpoint(file:File, line:number):Breakpoint {
        return new Breakpoint(file, line);
    }

    createStackFrame(level:number, file:File, line:number, char:number):StackFrame {
        return new StackFrame(level, file, line, char);
    }

    private onMessage(msg) {
        if (msg.init || msg.stream)
            this.getStatus();

        if (msg.stream)
            this.stdout.push(msg.stream.keyValue);

        if (msg.response) {
            var status = msg.response.$status;

            if (status) {
                this.status = status;

                if (status === "break") {
                    this.getContext();
                    this.getStack();
                } else {
                    this.stackChanged.next([]);
                }
            }

            var error = msg.response.error;

            if (error) {
                this.stop();
                this.stdout.push(error.message);
            }
        }
    }
}