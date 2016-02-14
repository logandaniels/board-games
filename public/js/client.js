"use strict";

var socket = null;

function createBitmap(data) {
    console.log("Creating bitmap: " + data);
    var imgPath = data['imgPath'];
    if (images.hasOwnProperty(imgPath)) {
        var img = images[imgPath];
    } else {
        var img = new Image();
        img.src = imgPath;
        images[imgPath] = img;
    }

    var bitmap = new createjs.Bitmap(img);
    bitmap.sourceRect = {x: data['imgX'], y: data['imgY'], width: data['imgWidth'], height: data['imgHeight']};
    bitmap.name = data['id'];
    bitmap.on("pressmove", dragPressMoveHandler);
    bitmap.on("mousedown", dragMouseDownHandler);
    bitmap.on("pressup", cardMouseUpHandler);
    stage.addChild(bitmap);
}

function spawnDeck(data) {
    console.log("Creating deck: " + data);
    var imgPath = data['imgPath'];
    if (images.hasOwnProperty(imgPath)) {
        var img = images[imgPath];
    } else {
        var img = new Image();
        img.src = imgPath;
        images[imgPath] = img;
    }

    var deck = new createjs.Bitmap(img);
    deck.sourceRect = {x: data['imgX'], y: data['imgY'], width: data['imgWidth'], height: data['imgHeight']};
    deck.name = data['id'];
    deck.on("click", deckClickHandler);
    deck.x = data['x'];
    deck.y = data['y'];
    stage.addChild(deck);
}

function sendObjectUpdate(id, x, y) {
    var data = {
        id: id,
        x: x, y: y
    };
    socket.emit('objectUpdate', data);
}

function onObjectUpdate(data) {
    if (data['id'] === undefined) {
        return;
    }
    console.log("Received object update for id " + data['id']);

    var obj = stage.getChildByName(data['id']);
    obj.x = data['x'];
    obj.y = data['y'];
}

function initSocket() {
    socket = io();

    $('form[id=sendMessage]').submit(function (e) {
        e.preventDefault();
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    $('#spawnDeck').submit(function (e) {
        e.preventDefault();
        socket.emit('spawnDeck', null);
        return false;
    });

    socket.on('createBitmap', createBitmap);
    socket.on('objectUpdate', onObjectUpdate);
    socket.on('spawnDeck', spawnDeck);

}