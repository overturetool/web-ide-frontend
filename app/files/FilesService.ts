import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";

@Injectable()
export class FilesService {
    private root:string = "vfs";

    constructor(private server: ServerService, private session: SessionService) {
    }

    readDir(path:string = "", depth:number = 0) {
        var fullPath = `${this.root}/${this.session.account}`;

        if (path !== "") fullPath += `/${path}`;
        if (depth > 1) fullPath += `?depth=${depth}`;

        return this.server
            .get(fullPath)
            .then(res => res.json());
    }

    readFile(path:string) {
        return this.server
            .get(`${this.root}/${path}`)
            .then(res => res.text());
    }

    writeFile(path:string, content:string) {
        if (!path) return;

        this.server
            .post(`${this.root}/${path}`, content);
    }
}
