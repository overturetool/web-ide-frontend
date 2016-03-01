import {Pipe, PipeTransform} from 'angular2/core';
import {File} from "./File";
import {Directory} from "./Directory";

@Pipe({name: 'files'})
export class FilesPipe implements PipeTransform {
    transform(nodes:Array<File | Directory>):Array<File> {
        return nodes.filter(node => node instanceof File);
    }
}