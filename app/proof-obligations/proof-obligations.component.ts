import {Component} from "angular2/core";
import {ProofObligationsService} from "./ProofObligationsService";
import {EditorService} from "../editor/EditorService";
import {CodeViewComponent} from "../code-view/code-view.component";

@Component({
    selector: "proof-obligations",
    directives: [CodeViewComponent],
    template: `
<div *ngFor="#item of items"
     (click)="onSelect(item)"
     (mouseenter)="onEnter(item)"
     (mouseleave)="onLeave()"
     class="proof-obligation list-item interactable">
    <div class="description"><code-view [code]="item.name"></code-view><code class="type"> {{item.kind}}</code></div>
    <code-view [code]="item.valuetree"></code-view>
</div>`
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
