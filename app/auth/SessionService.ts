import {Injectable} from "angular2/core"
import {Http} from "angular2/http"

@Injectable()
export class SessionService {
    public account: string;

    constructor() {
        this.account = "rsreimer";
    }
}