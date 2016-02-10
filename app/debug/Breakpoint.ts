export class Breakpoint {
    public id:number;

    constructor(public file:File,
                public line:number,
                public active:boolean = true,
                public synced:boolean = false) {

    }
}