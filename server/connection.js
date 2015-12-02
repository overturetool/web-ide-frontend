"use strict";

var Debugger = require('./debugger');

class Connection {
    constructor(socket) {
        this.socket = socket;
        this.debugger = new Debugger("bom.vdmsl");
        this.debugger.start()
            .then(init => socket.emit('debugger/init', init));

        socket.on('breakpoints/list', () => {
            this.debugger
                .listBreakpoints()
                .then(bps => socket.emit('breakpoints/list', bps));
        });
    }
}

module.exports = Connection;