import {Injectable} from "angular2/core"
import {Http, Response} from "angular2/http";
import {Headers} from "angular2/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ServerService {
    private root:string = "localhost:9000";
    private headers:Headers;
    private jsonHeaders:Headers;

    constructor(private http:Http) {
        var token = localStorage.getItem('access_token');
        if (token) this.registerAccessToken(token);
    }

    registerAccessToken(token:string) {
        if (token)
            localStorage.setItem('access_token', token);
        else
            token = localStorage.getItem('access_token');

        this.headers = new Headers();
        this.jsonHeaders = new Headers();

        this.headers.append('Authorization', `Bearer ${token}`);
        this.jsonHeaders.append('Authorization', `Bearer ${token}`);
        this.jsonHeaders.append('Content-Type', 'application/json');
    }

    connect(path:string):WebSocket {
        return new WebSocket(`ws://${this.root}/${path}`);
    }

    get(path:string):Observable<Response> {
        return this.http.get(`http://${this.root}/${path}`, {headers: this.headers});
    }

    post(path:string, body:any):Observable<Response> {
        if (typeof(body) !== "object")
            return this.http.post(`http://${this.root}/${path}`, body, {headers: this.headers});

        return this.http.post(`http://${this.root}/${path}`, JSON.stringify(body), {headers: this.jsonHeaders});
    }

    put(path:string, body:any):Observable<Response> {
        if (typeof(body) !== "object")
            return this.http.put(`http://${this.root}/${path}`, body, {headers: this.headers});

        return this.http.put(`http://${this.root}/${path}`, JSON.stringify(body),  {headers: this.jsonHeaders});
    }

    delete(path:string):Observable<Response> {
        return this.http.delete(`http://${this.root}/${path}`, {headers: this.headers});
    }
}
