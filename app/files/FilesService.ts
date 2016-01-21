import {Injectable} from "angular2/core"
import {ServerService} from "../server/ServerService";
import {SessionService} from "../auth/SessionService";
import {File,Directory} from "./file";

@Injectable()
export class FilesService {
    private root: Array<any>;

    constructor(private serverService: ServerService, private session: SessionService) {
        this.getRoot();
    }

    getRoot(): Promise {
        return new Promise(resolve => {
            if (this.root)
                resolve(this.root);
            else
                this.serverService
                    .get(`vfs/${this.session.account}?depth=10`)
                    .subscribe(res => {
                        this.root = res.json();
                        resolve(this.root);
                    });
        });
    }


    writeFile(file: File) {
        this.serverService.post(`vfs/${file.path}`, file.content);
    }
}
