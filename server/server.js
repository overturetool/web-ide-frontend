var express = require('express');
var http  = require('http');
var socketio = require('socket.io');

var app = express(),
    server = http.Server(app),
    io = socketio(server);

app.use(express.static('client'));
server.listen(8080);

var DbgpDebugger = require('./dbgp/dpgpDebugger'), Linter = require('./linter');

var debug = new DbgpDebugger();
var linter = new Linter();

io.on('connection', function(socket) {
    debug.bindToClient(socket);
});
