export class ReplItem {
    type:string = "code";

    constructor(public expression:string,
                public result:string) {
        this.type = result.startsWith("Error") ? "error" : "code";
    }
}