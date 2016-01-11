import {Injectable} from "angular2/core"
import {Http} from "angular2/http";
declare type Listener = (data:any)=>void

@Injectable()
export class ServerService {
    private root:string = "localhost:9000";

    constructor(private http: Http) {

    }

    connect(path) {
        return new WebSocket(`ws://${this.root}/${path}`);
    }

    get(path:string) {
        return new Promise(resolve =>
            this.http
                .get(`http://${this.root}/${path}`)
                .subscribe(response => resolve(response))
        )
    }

    post(path:string, body:string) {
        return new Promise(resolve =>
            this.http
                .post(`http://${this.root}/${path}`, body)
                .subscribe(response => resolve(response))
        );
    }
}
