import {Pipe, PipeTransform} from 'angular2/core';
import {File} from "./File";

@Pipe({name: 'files'})
export class FilesPipe implements PipeTransform {
    transform(nodes:Array, args:string[]) : any {
        return nodes.filter(node => node instanceof File);
    }
}