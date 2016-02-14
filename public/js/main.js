"use strict";

window.addEventListener("resize", resize, false);

var stage = null;
var circle = null;
var images = [];

var dx = 2;

// [From MDN] Returns a random integer between min (included) and max (excluded).
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
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = 30;
    createjs.Ticker.addEventListener("tick", update);


    stage = new createjs.Stage("myCanvas");
    resize();

    createjs.Touch.enable(stage);

    stage.preventSelection = true;

    stage.on("click", function (e) {
        e.nativeEvent.preventDefault();
    });

    //stage.addChild(deck);
    //deck.x = 300;
    //deck.y = 300;

    stage.addChild(snapLocation);
    snapLocation.x = 600;
    snapLocation.y = 300;


    circle = new createjs.Shape();
    circle.graphics.beginFill("Blue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    circle.addEventListener("click", e => {
        circle.graphics.beginFill("Red").drawCircle(0, 0, 50);
    });
    stage.addChild(circle);

    //stage.addChild(drawCard(cards));
    initSocket();
    stage.update();
}

function resize() {
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight * 0.8;
}
