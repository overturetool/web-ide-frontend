import {Injectable} from "angular2/core"
import {Http, HTTP_PROVIDERS} from "angular2/http"
import {SessionService} from "../auth/SessionService"

@Injectable()
export class FilesService {
    private root:string = "http://localhost:9000/vfs";

    constructor(private http: Http, private session: SessionService) {

    }

    private get(path) {
        return new Promise(resolve =>
            this.http
                .get(`${this.root}/${this.session.account}/${path}`)
                .subscribe(response =>
                    resolve(response))
        )
    }

    readDir(path:string = "", depth:number = 0) {
        if (depth > 1) path += `?depth=${depth}`;

        return this.get(path).then(res => res.json());
    }

    readFile(path:string) {
        return this.get(path).then(res => res.text());
    }
}
