import {Injectable} from "angular2/core";
import {BehaviorSubject} from "rxjs/Rx";
import {WorkspaceService} from "./WorkspaceService";
import {Example} from "./Example";

@Injectable()
export class ExamplesService {
    examples$:BehaviorSubject<Array<Example>>;
    active:boolean = false;

    constructor(private workspaceService:WorkspaceService) {
        this.examples$ = new BehaviorSubject([
            {
                name: "LUHN",
                description: `Luhn algorithm See http://en.wikipedia.org/wiki/Luhn_algorithm

The Luhn algorithm or Luhn formula, also known as the “modulus 10” or “mod 10” algorithm, is a simple checksum formula used to validate a variety of identification numbers, such as credit card numbers, IMEI numbers, National Provider Identifier numbers in US and Canadian Social Insurance Numbers. It was created by IBM scientist Hans Peter Luhn and described in U.S. Patent No. 2,950,048, filed on January 6, 1954, and granted on August 23, 1960.

The algorithm is in the public domain and is in wide use today. It is specified in ISO/IEC 7812-1.[1] It is not intended to be a cryptographically secure hash function; it was designed to protect against accidental errors, not malicious attacks. Most credit cards and many government identification numbers use the algorithm as a simple method of distinguishing valid numbers from collections of random digits.`,
                author: "Nick Battle",
                version: "VDM_SL - vdm10"
            },
            {
                name: "AbstractPacemaker",
                description: `This model is described in VDM-SL as a short, flat specification. This enables abstraction from design considerations and ensures maximum focus on high-level, precise and systematic analysis. This was developed by Sten Agerholm, Peter Gorm Larsen and Kim Sunesen in 1999 in connection with FM’99.`,
                author: "Sten Agerholm, Peter Gorm Larsen and Kim Sunesen",
                version: "VDM_SL - vdm10"
            },
            {
                name: "VCParser-master",
                description: `This example is created by Tomohiro Oda and it illustrates how it is possible to use higher-order functions in VDM-SL to create parser elements that can be put together in a compositional fashion. This model can be used as a kind of library that one can play with manipulating strings into a VDM AST representation.`,
                author: "Tomohiro Oda",
                version: "VDM_SL - classic"
            }
        ]);
    }

    import(example:Example) {
        var workspace = this.workspaceService.workspace$.getValue();
    }

    open() {
        this.active = true;
    }

    close() {
        this.active = false;
    }
}