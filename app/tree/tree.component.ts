import {Component} from "angular2/core";
import {NgFor} from "angular2/common";
import {Input} from "angular2/core";
import {NgIf} from "angular2/common";
import {CodeViewComponent} from "../code-view/code-view.component";

@Component({
    selector: 'tree',
    templateUrl: "app/tree/tree.component.html",
    directives: [CodeViewComponent, TreeComponent]
})
export class TreeComponent {
    @Input() nodes: Array<any>;
}