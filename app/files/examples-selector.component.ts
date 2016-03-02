import {ExamplesService} from "./ExamplesService";
import {Component} from "angular2/core";
import {Example} from "./Example";
import {OnInit} from "angular2/core";

@Component({
    selector: "examples-selector",
    templateUrl: "/app/files/examples-selector.component.html"
})
export class ExamplesSelectorComponent {
    examples:Array<Example> = [];
    current:Example = null;

    constructor(private examplesService:ExamplesService) {
        this.examplesService.examples$
            .subscribe(examples => this.examples = examples);
    }

    select(example:Example) {
        this.current = example;
    }

    importCurrent() {
        this.examplesService.importExample(this.current);
        this.examplesService.close();
    }

    onBackgroundClick(event) {
        if (event.target.matches('.background'))
            this.examplesService.close();
    }
}