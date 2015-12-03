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

    attach(runner, breakpoints) {

    }

    detach() {
        this.cli.stop();
    }

    getSources(callback) {

    }

    getSource(callback) {

    }

    getEnvironment() {
        this.cli.exec("env");
    }

    getFrames(callback) {
        this.cli
            .exec("stack")
            .then(frames => callback(frames));
    }

    getScope(frame, scope, callback) {

    }

    getProperties(variable, callback) {

    }

    stepInto() { // done
        this.cli.exec("step");
    }

    stepOver() { // done
        this.cli.exec("next");
    }

    stepOut() { // done
        this.cli.exec("out");
    }

    resume() { // done
        this.cli.exec("continue");
    }

    suspend() { // done
        this.cli.exec("stop");
    }

    evaluate(expression, frame, global, disableBreak, callback) {
        this.cli.exec("p " + expression);
    }

    setScriptSource(source, value, previewOnly, callback) {

    }

    setBreakpoint(breakpoint, callback) {
        this.cli.exec("break ");
    }

    changeBreakpoint(breakpoint, callback) {
        this.cli.exec("");
    }

    clearBreakpoint(breakpoint, callback) {
        this.cli.exec("remove ");
    }

    listBreakpoints(callback) {
        this.cli.exec("list");
    }

    setBreakBehavior(type, enabled, callback) {

    }

    setVariable(variable, parents, value, frame, callback) {

    }

    restartFrame() {

    }

    serializeVariable() {

    }
}

module.exports = Debugger;