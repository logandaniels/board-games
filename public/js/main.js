"use strict";

createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
createjs.Ticker.framerate = 30;
createjs.Ticker.addEventListener("tick", update);

var stage = null;
var circle = null;

var dx = 2;

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function update(e) {
    circle.x += dx;
    if (circle.x >= stage.canvas.width - 50 || circle.x <= 0) {
        dx *= -1;
    }
    stage.update();
}

function keyDownHandler(e) {
}

function keyUpHandler(e) {
}

function mouseHandler(e) {
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseHandler, false);

function initCanvas() {
    stage = new createjs.Stage("myCanvas");
    circle = new createjs.Shape();
    circle.graphics.beginFill("Blue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    stage.addChild(cards[getRandomInt(0, cards.length)]);
    circle.addEventListener("click", e => {
        circle.graphics.beginFill("Red").drawCircle(0, 0, 50);
    });
    stage.update();
}