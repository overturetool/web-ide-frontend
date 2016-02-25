import {Directory} from "./Directory";
import {DbgpDebugger} from "../debug/DbgpDebugger";
import {ServerService} from "../server/ServerService";

export class Project extends Directory {
    debug:DbgpDebugger;
    entry:string;
    private configFile:File;
    private config;

    constructor(serverService:ServerService,
                public parent:Directory,
                public name:string,
                public path:string,
                public children:Array<File|Directory>) {
        super(serverService, parent, name, path, children);

        this.debug = new DbgpDebugger(serverService, this);
    }

    getEntryPoints() {
        if (!this.configFile) {
            this.configFile = this.find([".project"]);
            this.configFile.content$.subscribe(content => this.config = JSON.parse(content));

            this.config = JSON.parse(this.configFile.document.getValue());
        }

        return this.config.entryPoints;
    }
}