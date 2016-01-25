import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'filename'})
export class FilenamePipe implements PipeTransform {
    transform(path:string, args:string[]) : any {
        var parts = path.split('/');
        return parts[parts.length -1];
    }
}