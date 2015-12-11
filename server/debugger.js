"use strict";

var DbgpDebugger = require('./dbgp/dpgpDebugger');
var cp = require('child_process');

class Debugger {
    constructor(socket) {
        this.dbg = new DbgpDebugger();
    }

    bindToClient(socket) {
        socket.on('debug/start', options => this.start(options.file, options.entry));
    }

    start(file, entry) {
        this.dbg.start()
            .then(() => {
                this.dbEngine = cp.exec(
                    `mvn exec:java -Dexec.mainClass="org.overture.interpreter.debug.DBGPReaderV2" -Dexec.args="-vdmsl -h localhost -p 9000 -k testKey -e \\\"${entry}\\\" ${file}"`,
                    {cwd: "/home/rsreimer/projects/Speciale/overture-dev/core/interpreter"}
                );
            })
    }

    detach() {
        this.dbEngine.disconnect();
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