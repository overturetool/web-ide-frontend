import {Directory} from "./Directory";
import {DbgpDebugger} from "../debug/DbgpDebugger";
import {ServerService} from "../server/ServerService";
import {File} from "../files/File";

export class Project extends Directory {
    entry:string;
    private configFile:File;
    private config:any = {};

    constructor(serverService:ServerService,
                public debug:DbgpDebugger,
                public parent:Directory,
                public name:string,
                public path:string,
                public children:Array<File|Directory>) {
        super(serverService, parent, name, path, children);
    }

    getEntryPoints() {
        if (!this.configFile) this.loadConfigFile();

        return this.config.entryPoints || [];
    }

    private loadConfigFile() {
        this.configFile = this.findFile([".project"]);

        if (!this.configFile) return;

        this.configFile.content$.subscribe(content => {
            try {
                this.config = JSON.parse(content);
            } catch(e) {}
        });

        try {
            this.config = JSON.parse(this.configFile.document.getValue());
        } catch(e) {}
    }
}