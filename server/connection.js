"use strict";

var Debugger = require('./debugger');

class Connection {
    constructor(socket) {
        this.socket = socket;
        this.debugger = new Debugger();
        this.debugger.load("bom.vdmsl")
            .then(init => this.socket.emit('log', init));

        this.socket.on('breakpoints/list', () => {
            this.debugger
                .listBreakpoints()
                .then(bps => this.socket.emit('log', bps));
        });

        this.socket.on('breakpoints/set', line => {
            this.debugger
                .setBreakpoint(line)
                .then(bps => this.socket.emit('log', bps));
        });
    }
}

module.exports = Connection;