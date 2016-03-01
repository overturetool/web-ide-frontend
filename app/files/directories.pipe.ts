import {Pipe, PipeTransform} from 'angular2/core';
import {Directory} from "./Directory";
import {File} from "./File";

@Pipe({name: 'directories'})
export class DirectoriesPipe implements PipeTransform {
    transform(nodes:Array<File | Directory>):Array<Directory> {
        return nodes.filter(node => node instanceof Directory);
    }
}