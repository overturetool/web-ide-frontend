import {Pipe, PipeTransform} from 'angular2/core';
import {Directory} from "./Directory";

@Pipe({name: 'directories'})
export class DirectoriesPipe implements PipeTransform {
    transform(nodes:Array, args:string[]) : any {
        return nodes.filter(node => node instanceof Directory);
    }
}