"use strict";

var app = require('./app');
var http = require('http').createServer(app);


var sio = {};

sio.init = function (server) {
    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('disconnect', _ => {
        })
        console.log('user disconnected');
    });

    io.on('connection', function (socket) {
        socket.on('chat message', function (msg) {
            console.log('message: ' + msg);
        });
    });
}


module.exports = sio;