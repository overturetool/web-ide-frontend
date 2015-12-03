"use strict";

var CLI = require('./cli');

class Debugger {
    constructor() {
        this.cli = new CLI();
    }

    load(file) {
        return new Promise(resolve => {
            this.cli.run('overture -vdmsl -i workspace/' + file, response => resolve(response));
        });
    }

    evaluate(expression) {
        return this.cli.exec("p " + expression);
    }

    listBreakpoints() {
        return this.cli.exec("list");
    }

    setBreakpoint(line, file) {
        return this.cli.exec("break " + line);
    }

    stepInto() {
        return this.cli.exec("step");
    }

    stepOver() {
        return this.cli.exec("next");
    }

    out() {
        return this.cli.exec("out");
    }

    continue() {
        return this.cli.exec("continue");
    }

    stop() {
        return this.cli.exec("stop");
    }

    getEnvironment() {
        return this.cli.exec("env");
    }

    getStackFrames(depth) {
        return this.cli.exec("stack");
    }

    quit() {
        return this.cli.exec("quit");
    }
}

module.exports = Debugger;