import {Component, Input} from "angular2/core";
import {CodeViewComponent} from "../code-view/code-view.component";

@Component({
    selector: 'tree',
    directives: [CodeViewComponent, TreeComponent],
    template: `
<ul>
    <li *ngFor="#node of nodes">
        <div class="variable list-item">
            <div class="description">
                <span class="icon" (click)="node.__open = !node.__open" *ngIf="node.property" [class.open]="node.__open" [class.close]="!node.__open"></span>
                <code-view [code]="node.$name"></code-view><code class="type"> {{node.$type}}</code>
            </div>

            <code-view [code]="node.keyValue"></code-view>
        </div>
        <div *ngIf="node.property && node.__open">
            <tree [nodes]="node.property.length ? node.property : [node.property]"></tree>
        </div>
    </li>
</ul>`
})
export class TreeComponent {
    @Input()
    nodes:Array<any>;
}