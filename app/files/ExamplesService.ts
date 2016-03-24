import {Injectable} from "angular2/core";
import {BehaviorSubject} from "rxjs/Rx";
import {WorkspaceService} from "./WorkspaceService";
import {Example} from "./Example";
import {ServerService} from "../server/ServerService";

@Injectable()
export class ExamplesService {
    examples$:BehaviorSubject<Array<Example>> = new BehaviorSubject([]);
    active:boolean = false;

    constructor(private serverService:ServerService,
                private workspaceService:WorkspaceService) {
        this.serverService.get('list')
            .map(res => res.json())
            .subscribe(examples => this.examples$.next(this.mapExamples(examples)));
    }

    importExample(example:Example) {
        this.serverService.get(`import?projectName=${example.name}`)
            .subscribe(() => {
                var workspace = this.workspaceService.workspace$.getValue();

                this.serverService.post(
                    `vfs/writeFile/${workspace.path}/${example.name}/.project`,
                    JSON.stringify({
                        entryPoints: example.entryPoints,
                        release: example.languageVersion
                    })
                ).subscribe(() => {
                    this.workspaceService.loadProject(example.name);
                });
            });
    }

    open() {
        this.active = true;
    }

    close() {
        this.active = false;
    }

    private mapExamples(examples:Array<any>) {
        return examples.map(example => new Example(
            example.name,
            example.description,
            example.author,
            example.languageVersion,
            example.entryPoints
        ));
    }
}