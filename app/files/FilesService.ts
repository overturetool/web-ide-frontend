import {Injectable} from "angular2/core"
import {Http, HTTP_PROVIDERS} from "angular2/http"
import {SessionService} from "../auth/SessionService"

@Injectable()
export class FilesService {
    private root:string = "http://localhost:9000/vfs";

    constructor(private http: Http, private session: SessionService) {

    }

    readDir(path:string = "", depth:number = 0) {
        var basePath = `${this.root}/${this.session.account}`;

        if (path !== "") basePath += `/${path}`;
        if (depth > 1) basePath += `?depth=${depth}`;

        return this.http.get(basePath);
    }
}
