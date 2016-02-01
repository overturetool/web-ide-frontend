import {Injectable} from "angular2/core"
import {Http} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {Headers} from "angular2/http";

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

    post(path:string, body:any):Observable {
        if (typeof(body) !== "object")
            return this.http.post(`http://${this.root}/${path}`, body);

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(`http://${this.root}/${path}`, JSON.stringify(body), {headers: headers});
    }

    put(path:string, body:any):Observable {
        if (typeof(body) !== "object")
            return this.http.put(`http://${this.root}/${path}`, body);

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(`http://${this.root}/${path}`, JSON.stringify(body), {headers: headers});
    }
}
