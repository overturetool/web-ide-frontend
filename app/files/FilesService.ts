import {Injectable} from "angular2/core"
import {Http} from "angular2/http"

@Injectable()
export class FilesService {
    constructor(http: Http) {
        var stuff = http.get("http://jsonplaceholder.typicode.com/posts")
    }
}
