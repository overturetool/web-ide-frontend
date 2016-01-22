import {Output, Injectable, EventEmitter} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";

@Injectable()
export class OutlineService {
    items:Array<OutlineItem>;

    constructor(private server:ServerService) {
    }

    update(path:string):void {
        if (!path) return;

        this.server.get(`outline/${path}`)
            .subscribe(res => this.items = res.json());
    }
}