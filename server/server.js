var Connection = require('./connection');
var express = require('express');
var http  = require('http');
var socketio = require('socket.io');

var app = express(),
    server = http.Server(app),
    io = socketio(server);

app.use(express.static('client'));
server.listen(8080);

var connections = [];

io.on('connection', function(socket) {
    connections.push(new Connection(socket));
});
