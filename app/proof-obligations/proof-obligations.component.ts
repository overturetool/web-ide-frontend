import {Component, Input, Output, EventEmitter} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {ProofObligationsService} from "./ProofObligationsService";

@Component({
    selector: "proof-obligations",
    templateUrl: "app/proof-obligations/proof-obligations.component.html"
})
export class ProofObligationsComponent {
    items:Array<ProofObligationsItem>;

    constructor(private proofObligationsService:ProofObligationsService) {
        this.proofObligationsService.items$.subscribe(items => this.items = items);
    }

    onEnter(item:ProofObligationsItem):void {
        this.proofObligationsService.highlight(item.location);
    }

    onLeave():void {
        this.proofObligationsService.highlight(null);
    }

    onSelect(item:ProofObligationsItem):void {
        this.proofObligationsService.focus(item.location.startLine);
    }
}
