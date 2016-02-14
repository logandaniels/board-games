"use strict";

var app = require('./app');
var http = require('http').createServer(app);

var Grid = {};

Grid.convertX = function (x) {
    return x / 1066;
};
Grid.convertY = function (y) {
    return y / 600;
};

var sio = {};
var id = 0;

var newBitmapData = {
    imgPath: "img/cards.png",
    imgX: 0, imgY: 0,
    imgWidth: 81, imgHeight: 117,
    gridX: 0, gridY: 0,
    gridWidth: Grid.convertX(81), gridHeight: Grid.convertY(117),
    interacting: false,
    id: id++
};

var gameObjects = {};
gameObjects[newBitmapData.id] = newBitmapData;

sio.init = function (server) {
    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
        console.log('a user connected');

        socket.emit('createBitmap', gameObjects[0]);

        socket.on('objectUpdate', function (data) {
            for (var key in data) {
                if (key === 'id') {
                    continue;
                }
                console.log("New value for " + key + " is " + data[key]);
                gameObjects[data['id']][key] = data[key];
            }

            socket.broadcast.emit('objectUpdate', data);
        });

        socket.on('spawnDeck', function () {
            console.log("Spawning deck");
            var deck = {
                imgPath: "img/cards.png",
                imgX: 0, imgY: 117 * 4,
                imgWidth: 81, imgHeight: 117,
                gridX: .2, gridY: .2,
                gridWidth: Grid.convertX(81), gridHeight: Grid.convertY(117),
                cards: [],
                interacting: false,
                id: id++
            };


            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 13; j++) {
                    var card = {};
                    card = {
                        imgPath: "img/cards.png",
                        imgX: j * 81, imgY: i * 117,
                        imgWidth: 81, imgHeight: 117,
                        gridWidth: Grid.convertX(81), gridHeight: Grid.convertY(117),
                        interacting: false,
                        id: id++
                    };
                    gameObjects[card.id] = card;
                    deck.cards.push(card);
                }
            }

            gameObjects[deck.id] = deck;
            io.emit('spawnDeck', deck);
        });

        socket.on('deckClick', function (data) {
            console.log("Handling deck click for deck id: " + data['id']);
            var deck = gameObjects[data['id']];
            if (deck.cards.length === 0) {
                return null;
            }
            var index = getRandomInt(0, deck.cards.length);
            var card = deck.cards[index];
            card.gridX = deck.gridX + Grid.convertX(deck.imgWidth);
            card.gridY = deck.gridY;
            deck.cards.splice(index, 1);
            io.emit('createBitmap', card);
        });

        socket.on('tryDrag', function (data, cb) {
            var obj = gameObjects[data['id']];
            var canDrag = !obj.interacting;
            if (canDrag) {
                obj.interacting = true;
            }
            cb(canDrag);
        });
        socket.on('endDrag', function (data, cb) {
            var obj = gameObjects[data['id']];
            obj.interacting = false;
        });

    });

};


// [From MDN] Returns a random integer between min (included) and max (excluded).
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


module.exports = sio;