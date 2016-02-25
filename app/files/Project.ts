import {Directory} from "./Directory";
import {DbgpDebugger} from "../debug/DbgpDebugger";
import {ServerService} from "../server/ServerService";

export class Project extends Directory {
    debug:DbgpDebugger;
    entry:string;

    constructor(serverService:ServerService,
                public parent:Directory,
                public name:string,
                public path:string,
                public children:Array<File|Directory>) {
        super(serverService, parent, name, path, children);

        this.debug = new DbgpDebugger(serverService, this);
        this.entry = this.name;
    }
}