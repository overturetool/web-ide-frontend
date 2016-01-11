class OutlineItem {
    constructor(
        public actualResult:string,
        public expectedResult:string,
        public location: EditorSection,
        public name:string,
        public parameters: Array<string>,
        public type: string
    ) { }
}