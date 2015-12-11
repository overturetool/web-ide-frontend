var express = require('express');
var http  = require('http');
var socketio = require('socket.io');

var app = express(),
    server = http.Server(app),
    io = socketio(server);

app.use(express.static('client'));
server.listen(8080);
/*
var Debugger = require('./debugger'), Linter = require('./linter');

var debug = new Debugger();
var linter = new Linter();

io.on('connection', function(socket) {
    debug.bindToClient(socket);

    debug.start(
        "file:/home/rsreimer/projects/Speciale/webide/workspace/bom.vdmsl",
        "Parts(1, bom)"
    );
});
*/