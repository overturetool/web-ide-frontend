import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {File,Directory} from "./file";

@Injectable()
export class FilesService {
    root: Array<any> = [];

    constructor(private serverService: ServerService, private session: SessionService) {
        this.serverService
            .get(`vfs/${this.session.account}?depth=10`)
            .subscribe(res => this.root = res.json());
    }

    writeFile(file: File) {
        this.serverService.post(`vfs/${file.path}`, file.content);
    }
}
