import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'directories'})
export class DirectoriesPipe implements PipeTransform {
    transform(files:Array, args:string[]) : any {
        return files.filter(file => file.type === "directory");
    }
}