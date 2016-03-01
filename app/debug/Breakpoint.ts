import {File} from "../files/File";

export class Breakpoint {
    public id:number;

    constructor(public file:File,
                public line:number,
                public synced:boolean = false) {

    }
}