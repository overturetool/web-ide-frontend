"use strict";

var Debugger = require('./debugger');

class Connection {
    constructor(socket) {
        this.socket = socket;
        this.debugger = new Debugger("bom.vdmsl");

        socket.on('breakpoints/list', () => {
            this.debugger
                .listBreakpoints()
                .then(bps => socket.emit('breakpoints/list', bps));
        });
    }
}

module.exports = Connection;