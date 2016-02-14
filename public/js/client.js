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
    bitmap.gridX = data.gridX;
    bitmap.gridY = data.gridY;
    bitmap.gridWidth = data.gridWidth;
    bitmap.gridHeight = data.gridHeight;
    bitmap.on("pressmove", dragPressMoveHandler);
    bitmap.on("mousedown", dragMouseDownHandler);
    bitmap.on("pressup", cardMouseUpHandler);
    Grid.scaleAndPositionBitmap(bitmap);
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
    bitmap.gridX = data.gridX;
    bitmap.gridY = data.gridY;
    bitmap.gridWidth = data.gridWidth;
    bitmap.gridHeight = data.gridHeight;
    deck.on("click", deckClickHandler);
    Grid.scaleAndPositionBitmap(deck);
    stage.addChild(deck);
}

function sendObjectUpdate(id, gridX, gridY) {
    var data = {
        id: id,
        gridX: gridX, gridY: gridY
    };
    socket.emit('objectUpdate', data);
}

function onObjectUpdate(data) {
    if (data['id'] === undefined) {
        return;
    }
    console.log("Received object update for id " + data['id']);

    var obj = stage.getChildByName(data['id']);
    obj.gridX = data.gridX;
    obj.gridY = data.gridY;
    Grid.scaleAndPositionBitmap(obj);
}

var Grid = {};

Grid.coordToPixel = function (x, y) {
    // using 0 -> 1.0; Left to right, top to bottom
    var w = stage.canvas.width;
    var h = stage.canvas.height;
    return {
        x: x * w,
        y: y * h
    };
}

Grid.pixelToCoord = function (x, y) {
    // using 0 -> 1.0; Left to right, top to bottom
    var w = stage.canvas.width;
    var h = stage.canvas.height;
    return {
        x: x / w,
        y: y / h
    };
}

Grid.scaleAndPositionBitmap = function (bitmap) {
    // desired width and height in pixels
    var dimensions = Grid.coordToPixel(bitmap.gridWidth, bitmap.gridHeight);
    var desiredWidth = dimensions.x;
    var desiredHeight = dimensions.y;

    var pos = Grid.coordToPixel(bitmap.gridX, bitmap.gridY);
    bitmap.x = pos.x;
    bitmap.y = pos.y;

    var w = bitmap.sourceRect.width;
    var h = bitmap.sourceRect.height;

    bitmap.scaleX = desiredWidth / w;
    bitmap.scaleY = desiredHeight / h;
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