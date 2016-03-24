import {Injectable} from "angular2/core";
import {Subject} from "rxjs/Subject";
import {ServerService} from "../server/ServerService";
import {EditorService} from "../editor/EditorService";

@Injectable()
export class ProofObligationsService {
    items$:Subject<Array<ProofObligationsItem>> = new Subject();

    constructor(private serverService:ServerService,
                private editorService:EditorService) {
        this.editorService.currentFile$.subscribe(file => this.update(file));
        this.editorService.changes$.subscribe(file => this.update(file));
    }

    update(file) {
        if (!file) {
            this.items$.next([]);
        } else {
            this.serverService.get(`pog/${file.path}`)
                .map(res => res.json())
                .subscribe(items => this.items$.next(items));
        }
    }
}