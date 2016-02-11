import {BehaviorSubject} from "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Injectable} from "angular2/core";
import {EditorPosition} from "./EditorPosition";

@Injectable()
export class EditorService {
    openFiles$:BehaviorSubject<Array<File>> = new BehaviorSubject([]);
    currentFile$:BehaviorSubject<File> = new BehaviorSubject(null);
    changes$:Subject<File> = new Subject();

    highlight$:Subject<EditorSection> = new Subject();
    goto$:Subject<EditorPosition> = new Subject();
    focus$:Subject<number> = new Subject();

    loadFile(file:File):void {
        var currentFile = this.currentFile$.getValue();

        if (currentFile === file) return;

        this.currentFile$.next(file);

        var openFiles = this.openFiles$.getValue();
        if (openFiles.indexOf(file) === -1)
            this.openFiles$.next([...openFiles, file]);
    }

    closeFile(file:File):void {
        var openFiles = this.openFiles$.getValue();

        if (this.currentFile$.getValue() === file) {
            var index = openFiles.indexOf(file);

            if (index > 0)
            // Open file to the left
                this.currentFile$.next(openFiles[index - 1]);
            else
            // Open file to the right or no file
                this.currentFile$.next(index + 1 < openFiles.length ? openFiles[index + 1] : null);
        }

        this.openFiles$.next(openFiles.filter(f => f !== file));
    }

    onChange() {
        this.changes$.next(this.currentFile$.getValue());
    }

    goto(line:number, char?:number) {
        this.goto$.next(new EditorPosition(line, char));
    }

    focus(line:number) {
        this.focus$.next(line);
    }
}