"use strict";

class Card {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.x = 0;
        this.y = 0;
    }

    draw(ctx) {
        var paddingLeft = 10;
        var paddingTop = 15;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "blue";
        ctx.strokeWidth = 2;
        ctx.stroke();
        ctx.closePath();

        ctx.font = "20px serif";
        ctx.fillStyle = "black";
        //ctx.textAlign = "center";
        ctx.fillText("Ace of Spades", this.x + paddingLeft, this.y + paddingTop, this.w - paddingLeft);

    }

}