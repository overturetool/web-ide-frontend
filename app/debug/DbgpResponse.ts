// Source: https://developer.mozilla.org/en-US/docs/JXON#Algorithm_3_a_synthetic_technique

export class DbgpResponse {
    public body: any;

    constructor(xml:string) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(xml, "text/xml");
        this.body = this.getJXONTree(doc);
    }

    private parseText(sValue) {
        if (/^\s*$/.test(sValue)) { return null; }
        if (/^(?:true|false)$/i.test(sValue)) { return sValue.toLowerCase() === "true"; }
        if (isFinite(sValue)) { return parseFloat(sValue); }
        return sValue;
    }

    private getJXONTree(oXMLParent) {
        var vResult:any = true, oAttrib, nLength = 0, sCollectedTxt = "";
        if (oXMLParent.hasAttributes && oXMLParent.hasAttributes()) {
            vResult = {};
            for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
                oAttrib = oXMLParent.attributes.item(nLength);
                vResult["$" + oAttrib.name.toLowerCase()] = this.parseText(oAttrib.value.trim());
            }
        }
        if (oXMLParent.hasChildNodes()) {
            for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
                oNode = oXMLParent.childNodes.item(nItem);
                if (oNode.nodeType === 4) { sCollectedTxt += atob(oNode.nodeValue).trim(); } /* nodeType is "CDATASection" (4) */
                else if (oNode.nodeType === 3) { sCollectedTxt += oNode.nodeValue.trim(); } /* nodeType is "Text" (3) */
                else if (oNode.nodeType === 1 && !oNode.prefix) { /* nodeType is "Element" (1) */
                    if (nLength === 0) { vResult = {}; }
                    sProp = oNode.nodeName.toLowerCase();
                    vContent = this.getJXONTree(oNode);
                    if (vResult.hasOwnProperty(sProp)) {
                        if (vResult[sProp].constructor !== Array) { vResult[sProp] = [vResult[sProp]]; }
                        vResult[sProp].push(vContent);
                    } else { vResult[sProp] = vContent; nLength++; }
                }
            }
        }
        if (sCollectedTxt) { nLength > 0 ? vResult.keyValue = this.parseText(sCollectedTxt) : vResult = this.parseText(sCollectedTxt); }

        return vResult;
    }
}