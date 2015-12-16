process.env.DEBUG = "engine:ws";

var express = require('express');
var http  = require('http');
var socketio = require('socket.io');

var app = express(),
    server = http.Server(app),
    io = socketio(server);

app.use(express.static('client'));
server.listen(8080);

var DbgpDebugger = require('./dbgp/dpgpDebugger'),
    Linter = require('./linter'),
    CodeCompletion = require('./codecompletion');

var debug = new DbgpDebugger();
var linter = new Linter();
var codeCompletion = new CodeCompletion();

io.on('connection', function(socket) {
    debug.bindToClient(socket);
    linter.bindToClient(socket);
});