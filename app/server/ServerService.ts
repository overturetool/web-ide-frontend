import {Injectable} from "angular2/core"
declare type Listener = (data:any)=>void

export class ServerService {
    emit(event:string, data?:any):void {

    }

    on(event:string, listener:Listener):void {

    }

    once(event:string, listener:Listener):void {

    }
}
