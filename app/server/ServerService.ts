import {Injectable} from "angular2/core"
import {Http} from "angular2/http";
declare type Listener = (data:any)=>void

@Injectable()
export class ServerService {
    private root:string = "http://localhost:9000";

    constructor(private http: Http) {
    }

    emit(event:string, data?:any):void {

    }

    on(event:string, listener:Listener):void {

    }

    once(event:string, listener:Listener):void {

    }

    get(path) {
        return new Promise(resolve =>
            this.http
                .get(`${this.root}/${path}`)
                .subscribe(response => resolve(response))
        )
    }
}
