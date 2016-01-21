import {Component, View} from 'angular2/core'
import {DebugComponent} from "../debug/debug.component"
import {FilesComponent} from "../files/files.component";
import {PanelComponent} from "../panel/panel.component";
import {PanelMenuComponent} from "../panel/panel-menu.component";
import {OutlineComponent} from "../outline/outline.component";
import {EditorTabsComponent} from "../editor/editor-tabs.component";
import {FilesService} from "../files/FilesService";
import {File} from "../files/file";

@Component({
    selector: 'ide',
    templateUrl: 'app/ide/ide.component.html',
    directives: [EditorTabsComponent, DebugComponent, FilesComponent, PanelComponent, PanelMenuComponent, OutlineComponent]
})
export class IdeComponent {
    openFiles: Array<File> = [];

    constructor(public filesService: FilesService) {
    }

    open(file:File) {
        this.openFiles.push(file);
    }

    close(file:File) {
        var index = this.openFiles.indexOf(file);
        if (!index) return;

        this.openFiles.splice(index, 1);
    }
}