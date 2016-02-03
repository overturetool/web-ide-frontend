declare type ProofObligationsItem = {
    rootNode: string,
    name: string,
    isaName: string,
    valuetree: string,
    stitch: string,
    status: string,
    kind: string,
    number: number,
    generator: string,
    location: {
        executable:boolean,
        file: string,
        module: string,
        startLine:number,
        endLine: number,
        startOffset: number,
        endOffset: number,
        startPos: number,
        endPos: number,
        hits: number
    },
    locale: string
}