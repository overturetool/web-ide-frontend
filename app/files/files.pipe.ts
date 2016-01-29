import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'files'})
export class FilesPipe implements PipeTransform {
    transform(files:Array, args:string[]) : any {
        return files.filter(file => file.type === "file");
    }
}