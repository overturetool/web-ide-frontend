import {Component} from "angular2/core";
import {NgFor} from "angular2/common";
import {Input} from "angular2/core";
import {NgIf} from "angular2/common";
import {TreeComponent} from "./tree.component";

@Component({
    selector: 'node',
    templateUrl: "app/tree/node.component.html",
    directives: [NgIf, TreeComponent]
})
export class NodeComponent {
    @Input() data: Array<any>;

    expanded: boolean = false;
}