import {Pipe, PipeTransform} from 'angular2/core';
import {Directory} from "./Directory";
import {File} from "./File";

@Pipe({name: 'path'})
export class PathPipe implements PipeTransform {
    transform(file:File):string {
        return file.path.split('/').slice(1).join('/');
    }
}