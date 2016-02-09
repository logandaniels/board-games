"use strict";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var card = new Card(60, 50);
function draw(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    card.draw(ctx);


    window.requestAnimationFrame(draw);
}

function keyDownHandler(e) {
}

function keyUpHandler(e) {
}

function mouseHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseHandler, false);

window.requestAnimationFrame(draw);