"use strict";

var data = {
    images: ["img/cards.png"],
    frames: {
        width: 81,
        height: 117
    }
}

var sheet = new createjs.SpriteSheet(data);
var sprite = new createjs.Sprite(sheet);

var cardsImage = new Image();
cardsImage.src = "img/cards.png";

//var CARD = {}
//
//    SUITS: {
//        HEART : "HEARTS",
//        DIAMOND : "DIAMOND",
//        CLUB : "CLUB",
//        SPADE : "SPADE"
//    },
//
//    VALUES: {},
//
//    cardOrder: []
//}

function getColorString(r, g, b, a = 1.0) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

var snapLocation = new createjs.Shape();
snapLocation.graphics
    .beginFill(getColorString(10, 10, 10, .2))
    .drawRect(0, 0, 81, 117);
snapLocation.setBounds(0, 0, 81, 117);

var snaps = [];
snaps.push(snapLocation);



var cards = [];

//var deck = new createjs.Bitmap(cardsImage);
//deck.sourceRect = {x: 0, y: 117 * 4, width: 81, height: 117};
//deck.on("click", deckClickHandler);

function drawCard(cards) {
    if (cards.length == 0) {
        return null;
    }
    var index = getRandomInt(0, cards.length);
    var card = cards[index];
    cards.splice(index, 1);
    card.lastTouched = Date.now();
    return card;
}

function dragMouseDownHandler(e) {
    e.nativeEvent.preventDefault();
    var card = e.target;
    socket.emit('tryDrag', {id: card.name}, function (canDrag) {
        console.log("canDrag: " + canDrag);
        if (canDrag) {
            stage.setChildIndex(card, stage.children.length - 1);
            card.dragging = true;
            var eventCoords = Grid.pixelToCoord(e.stageX, e.stageY);
            card.lastDragX = eventCoords.x;
            card.lastDragY = eventCoords.y;
        }
    });
}

function dragPressMoveHandler(e) {
    e.nativeEvent.preventDefault();
    var card = e.target;
    if (!card.dragging) {
        return;
    }
    var eventCoords = Grid.pixelToCoord(e.stageX, e.stageY);
    card.gridX += eventCoords.x - card.lastDragX;
    card.gridY += eventCoords.y - card.lastDragY;
    Grid.scaleAndPositionBitmap(card);
    card.lastDragX = eventCoords.x;
    card.lastDragY = eventCoords.y;
}

function cardMouseUpHandler(e) {
    e.nativeEvent.preventDefault();
    var card = e.target;
    if (!card.dragging) {
        return;
    }
    trySnap(card);
    card.dragging = false;
    socket.emit('endDrag', {id: card.name});
    sendObjectUpdate(card.name, card.gridX, card.gridY);
}

function between(val, lbound, rbound) {
    return val > lbound && val < rbound;
}

function trySnap(card) {
    var cb = card.getBounds();
    for (let snap of snaps) {
        var sb = snap.getBounds();
        var sCenterX = sb.x + sb.width / 2;
        var sCenterY = sb.y + sb.height / 2;
        var pt = snap.localToLocal(sCenterX, sCenterY, card);
        if (between(pt.x, cb.x, cb.x + cb.width)
            && between(pt.y, cb.y, cb.y + cb.height)) {
            card.x = snap.x;
            card.y = snap.y;
        }
    }
}

function deckClickHandler(e) {
    console.log("Deck was clicked");
    var deck = e.target;
    var data = {
        id: deck.name
    }
    socket.emit('deckClick', data);
}

function deckClickHandler2(e) {
    var deck = e.target;
    var newCard = drawCard(cards);
    if (newCard === null) {
        return;
    }

    newCard.x = deck.x + deck.getBounds().width + 5;
    newCard.y = deck.y;

    deck.stage.addChild(newCard);
}


for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 13; j++) {
        var card = new createjs.Bitmap(cardsImage);
        card.sourceRect = {x: j * 81, y: i * 117, width: 81, height: 117};
        card.on("pressmove", dragPressMoveHandler);
        card.on("mousedown", dragMouseDownHandler);
        card.on("pressup", cardMouseUpHandler);
        cards.push(card);
    }
}


class Card {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw(ctx) {
        var textSize = this.h / 5;
        var paddingHorizontal = this.w / 8;
        var paddingTop = textSize;

        ctx.font = `${textSize}px serif`;

        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "blue";
        ctx.strokeWidth = 3;
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("Ace of Spades", this.x + this.w / 2, this.y + paddingTop);

    }

}