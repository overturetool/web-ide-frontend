import {Output, Injectable, EventEmitter} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";

@Injectable()
export class OutlineService {
    private root:string = "outline";

    outline:EventEmitter<OutlineItem> = new EventEmitter();

    constructor(private server:ServerService) {
    }

    update(file):void {
        if (!file) return;

        this.server
            .get(`${this.root}/${file}`)
            .then(res => this.outline.emit(res.json()));
    }
}