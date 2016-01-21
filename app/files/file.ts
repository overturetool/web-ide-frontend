export class Directory {
    constructor(
        public name: string,
        public path: string,
        public children: Array<File|Directory>
    ) {}
}

export class File {
    constructor(
        public name: string,
        public path: string,
        public content: string = null
    ) {}
}