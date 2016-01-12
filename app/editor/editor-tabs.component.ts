import {Component} from "angular2/core"
import {EditorComponent} from "./editor.component";
import {File} from "../files/file";

@Component({
    selector: 'editor-tabs',
    templateUrl: "app/editor/editor-tabs.component.html",
    directives: [EditorComponent]
})
export class EditorTabsComponent {
    files: Array<File> = [new File("rsreimer/bom.vdmsl", "bla")];

}