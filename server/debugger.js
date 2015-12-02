"use strict";

var CLI = require('./cli');

class Debugger {
    constructor(file) {
        this.cli = new CLI('overture -vdmsl -i workspace/' + file);
    }

    listBreakpoints() {
        return this.cli.exec("list");
    }

    setBreakpoint(line, file = "") {
        this.cli.exec("break " + line);
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
        this.cli.exec("stop");
    }

    getEnvironment() {
        return this.cli.exec("env");
    }

    getStackFrames(depth) {
        var stack = [];

        return this.cli.exec("stack")
            .then(frame => {
                stack.push(frame);
                return this.cli.exec("up");
            })
            .then(() => this.cli.exec("stack"))
            .then(frame => {
                stack.push(frame);
                return stack;
            });
    }

    quit() {

    }
}

module.exports = Debugger;