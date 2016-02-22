import {Component, Input, Output, EventEmitter} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {ProofObligationsService} from "./ProofObligationsService";
import {EditorService} from "../editor/EditorService";
import {CodeViewComponent} from "../code-view/code-view.component";

@Component({
    selector: "proof-obligations",
    templateUrl: "app/proof-obligations/proof-obligations.component.html",
    directives: [CodeViewComponent]
})
export class ProofObligationsComponent {
    items:Array<ProofObligationsItem>;

    constructor(private proofObligationsService:ProofObligationsService,
                private editorService:EditorService) {
        this.proofObligationsService.items$.subscribe(items => this.items = items);
    }

    onEnter(item:ProofObligationsItem):void {
        this.editorService.highlight(item.location);
    }

    onLeave():void {
        this.editorService.highlight(null);
    }

    onSelect(item:ProofObligationsItem):void {
        this.editorService.focus(item.location.startLine);
    }
}
