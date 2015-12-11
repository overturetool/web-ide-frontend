var express = require('express');
var http  = require('http');
var socketio = require('socket.io');

var app = express(),
    server = http.Server(app),
    io = socketio(server);

app.use(express.static('client'));
server.listen(8080);

var Debugger = require('./debugger'), Linter = require('./linter');

var debug = new Debugger(app);
var linter = new Linter();

io.on('connection', function(socket) {
    debug.attach(
        "file:/home/rsreimer/projects/Speciale/webide/workspace/bom.vdmsl",
        "Parts(1, bom)"
    );

    socket.on('debug/load', () => {
        debug.attach("bom.vdmsl").then(init => socket.emit('log', init));
    });

    socket.on('breakpoints/list', () => {
        debug.listBreakpoints()
            .then(bps => socket.emit('log', bps));
    });

    socket.on('breakpoints/set', line => {
        debug.setBreakpoint(line)
            .then(bps => socket.emit('log', bps));
    });

    socket.on('lint', path => {
        linter.lint(path)
            .then(markers => socket.emit('markers', markers));
    });
});
