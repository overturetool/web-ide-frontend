import {Injectable} from "angular2/core"
import {Http} from "angular2/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ServerService {
    private root:string = "localhost:9000";

    constructor(private http:Http) {
    }

    connect(path:string):WebSocket {
        return new WebSocket(`ws://${this.root}/${path}`);
    }

    get(path:string):Observable {
        return this.http.get(`http://${this.root}/${path}`);
    }

    post(path:string, body:string):Observable {
        return this.http.post(`http://${this.root}/${path}`, body);
    }
}
