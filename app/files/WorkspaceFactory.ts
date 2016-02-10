import {Directory} from "./Directory";
import {File} from "./File";
import {EditorService} from "../editor/EditorService";
import {ServerService} from "../server/ServerService";
import {Injectable} from "angular2/core";

@Injectable()
export class WorkspaceFactory {
    constructor(private editorService:EditorService,
                private serverService:ServerService) {

    }

    createFile(parent:Directory, name:string, path:string, content:string = ""):File {
        var file = new File(this.serverService, this.editorService);

        file.parent = parent;
        file.name = name;
        file.path = path;
        file.content$.next(content);

        parent.children.push(file);

        return file;
    }

    createDirectory(parent:Directory, name:string, path:string, children:Array<File|Directory> = []):Directory {
        var directory = new Directory(this.serverService);

        directory.parent = parent;
        directory.name = name;
        directory.path = path;
        directory.children = children;

        if (parent)
            parent.children.push(directory);

        return directory;
    }
}