"use strict";

var net = require('net');
var cp = require('child_process');

class Debugger {
    constructor(app) {
        app.get('debug/list-breakpoints', (req, res) => {

        });
    }

    attach(file, entry) {
        var cmd = `mvn exec:java -Dexec.mainClass="org.overture.interpreter.debug.DBGPReaderV2" -Dexec.args="-vdmsl -h localhost -p 9000 -k testKey -e \\\"${entry}\\\" ${file}"`;
        var options = {cwd: "/home/rsreimer/projects/Speciale/overture-dev/core/interpreter"};

        if (!this.server) {
            this.server = net.createServer(client => {
                client.on('data', this.parse);
                client.on('end', this.detach);
            });

            this.server.listen(9000, "localhost", () => this.debug = cp.exec(cmd, options));
        } else {
            this.debug = cp.exec(cmd, options);
        }
    }

    parse(stream) {
        console.log(stream.toString());
    }

    detach() {
        this.debug.disconnect();
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