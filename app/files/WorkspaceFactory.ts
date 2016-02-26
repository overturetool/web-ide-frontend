import {Directory} from "./Directory";
import {File} from "./File";
import {EditorService} from "../editor/EditorService";
import {ServerService} from "../server/ServerService";
import {Injectable} from "angular2/core";
import {Project} from "./Project";

@Injectable()
export class WorkspaceFactory {
    constructor(private editorService:EditorService,
                private serverService:ServerService) {

    }

    createFile(parent:Directory, name:string, path:string):File {
        var file = new File(this.serverService, this.editorService, parent, name, path);

        parent.children.push(file);

        return file;
    }

    createDirectory(parent:Directory, name:string, path:string, children:Array<File|Directory> = []):Directory {
        var directory = new Directory(this.serverService, parent, name, path, children);

        if (parent)
            parent.children.push(directory);

        return directory;
    }

    createProject(workspace:Directory, name:string, path:string, children:Array<File|Directory> = []):Project {
        var project = new Project(this.serverService, workspace, name, path, children);

        workspace.children.push(project);

        return project;
    }
}