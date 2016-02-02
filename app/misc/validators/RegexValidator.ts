import {Control} from "angular2/common";

export class RegexValidator {
    static regex(pattern: Object): Function {
        return (control: Control): {[key: string]: any} => {
            return control.value.match(pattern) ? null : {pattern: true};
        };
    }
}