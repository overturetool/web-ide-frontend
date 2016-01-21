import {Output, Injectable, EventEmitter} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";

@Injectable()
export class OutlineService {
    items:Array<OutlineItem>;

    constructor(private server:ServerService) {
    }

    update(file:File):void {
        if (!file) return;

        this.server
            .get(`outline/${file.path}`)
            .subscribe(res => this.items = res.json());
    }
}