"use strict";

window.addEventListener("resize", resize, false);
window.addEventListener("orientationchange", resize, false);


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

    var fill = new createjs.Shape();
    fill.graphics.beginFill("white").drawRect(0, 0, stage.canvas.width, stage.canvas.height);
    fill.name = "bg";

    stage.addChild(fill);

    createjs.Touch.enable(stage);

    stage.preventSelection = true;

    stage.on("click", function (e) {
        e.nativeEvent.preventDefault();
    });

    //stage.addChild(deck);
    //deck.x = 300;
    //deck.y = 300;

    //stage.addChild(snapLocation);
    //snapLocation.x = 600;
    //snapLocation.y = 300;

    //stage.addChild(drawCard(cards));
    initSocket();
    stage.update();
}

function resize() {
    console.log("resizing");
    // Resize to a 16:9 resolution
    if (window.innerWidth < window.innerHeight) {
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = 9.0 / 16.0 * window.innerWidth;
    } else {
        stage.canvas.width = 16.0 / 9.0 * window.innerHeight;
        stage.canvas.height = window.innerHeight;
    }

    for (var i = 0; i < stage.children.length; i++) {
        var child = stage.children[i];
        if (child.name === "bg") {
            child.graphics.clear().beginFill("white").drawRect(0, 0, stage.canvas.width, stage.canvas.height);
        } else {
            Grid.scaleAndPositionBitmap(child);
        }
    }
}
