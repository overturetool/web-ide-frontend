import {ServerService} from "../server/ServerService"

export class DebugService {
    private server;

    constructor() {
        this.server = ServerService;
    }

    start():void {
        this.server.emit('debug/start', {
            file: "file:/home/rsreimer/projects/Speciale/webide/workspace/bom.vdmsl",
            entry: "Parts(1, bom)"
        });
    }

    run():void {
        this.server.emit('debug/run');
    }

    suspend():void {
        this.server.emit('debug/suspend');
    }

    stop():void {
        this.server.emit('debug/stop');
    }
}