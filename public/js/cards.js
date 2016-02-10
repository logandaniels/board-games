"use strict";

var data = {
    images: ["img/cards.gif"],
    frames: {
        width: 81,
        height: 117
    }
}

var sheet = new createjs.SpriteSheet(data);
var sprite = new createjs.Sprite(sheet);

var cardsImage = new Image();
cardsImage.src = "img/cards.gif";

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

var cards = [];

var cardBack = new createjs.Bitmap(cardsImage);
cardBack.sourceRect = {x: 0, y: 117 * 4, width: 81, height: 117};

function cardMouseDownHandler(e) {
    var card = e.target;
    card.lastDragX = e.stageX;
    card.lastDragY = e.stageY;
}

function cardMoveHandler(e) {
    var card = e.target;
    card.x += e.stageX - card.lastDragX;
    card.y += e.stageY - card.lastDragY;
    card.lastDragX = e.stageX;
    card.lastDragY = e.stageY;
}

for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 13; j++) {
        var card = new createjs.Bitmap(cardsImage);
        card.sourceRect = {x: j * 81, y: i * 117, width: 81, height: 117};
        card.on("pressmove", cardMoveHandler);
        card.on("mousedown", cardMouseDownHandler);
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