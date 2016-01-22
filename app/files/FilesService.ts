import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import 'rxjs/add/operator/map';

@Injectable()
export class FilesService {
    root:Array<any> = [];

    constructor(private serverService:ServerService, private session:SessionService) {
        this.serverService
            .get(`vfs/${this.session.account}?depth=10`)
            .subscribe(res => this.root = res.json());
    }

    writeFile(path:string, content:string):void {
        this.serverService.post(`vfs/${path}`, content);
    }

    readFile(path:string) {
        return this.serverService.get(`vfs/${path}`).map(res => res.text());
    }
}
