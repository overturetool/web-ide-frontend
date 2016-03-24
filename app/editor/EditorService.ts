import {BehaviorSubject} from "rxjs/Rx";
import {Subject} from "rxjs/Subject";
import {Injectable} from "angular2/core";
import {EditorPosition} from "./EditorPosition";
import {Project} from "../files/Project";
import {File} from "../files/File";

@Injectable()
export class EditorService {
    openFiles$:BehaviorSubject<Array<File>> = new BehaviorSubject([]);
    currentFile$:BehaviorSubject<File> = new BehaviorSubject(null);
    currentProject$:BehaviorSubject<Project> = new BehaviorSubject(null);
    changes$:Subject<File> = new Subject();

    highlight$:Subject<EditorSection> = new Subject();
    goto$:Subject<EditorPosition> = new Subject();
    focus$:Subject<number> = new Subject();

    loadFile(file:File):void {
        if (this.currentFile$.getValue() === file) return;

        if (file) {
            // Find files project
            var project = file.parent;
            while (!(project instanceof Project)) {
                project = project.parent;
            }

            this.currentProject$.next(project);
            this.currentFile$.next(file);

            // Add file to list of open files
            var openFiles = this.openFiles$.getValue();
            if (openFiles.indexOf(file) === -1)
                this.openFiles$.next([...openFiles, file]);
        } else {
            this.currentProject$.next(null);
            this.currentFile$.next(null);
        }
    }

    closeFile(file:File):void {
        var openFiles = this.openFiles$.getValue();

        if (this.currentFile$.getValue() === file) {
            var index = openFiles.indexOf(file);

            if (index > 0)
            // Open file to the left
                this.loadFile(openFiles[index - 1]);
            else
            // Open file to the right or no file
                this.loadFile(index + 1 < openFiles.length ? openFiles[index + 1] : null);
        }

        this.openFiles$.next(openFiles.filter(f => f !== file));
    }

    onChange(content:string):void {
        var file = this.currentFile$.getValue();

        file.save(content)
            .subscribe(() => this.changes$.next(file));
    }

    goto(line:number, char?:number) {
        this.goto$.next(new EditorPosition(line, char));
    }

    highlight(section:EditorSection) {
        this.highlight$.next(section);
    }

    focus(line:number) {
        this.focus$.next(line);
    }
}