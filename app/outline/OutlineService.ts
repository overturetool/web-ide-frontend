import {Injectable} from "angular2/core";
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";

@Injectable()
export class OutlineService {
    private root:string = "outline";

    constructor(private server: ServerService) {

    }

    getOutline(path) {
        return this.server
            .get(`${this.root}/${path}`)
            .then(res => res.json());
    }
}