﻿///<reference path="./Scene.ts" />

class TitleScene extends Scene {

    public constructor(protected canvas: HTMLCanvasElement) {
        super(canvas);
    }
    public drawTitle(text: string, font: string, x: number, y: number) {
        let ctx = this.context;
        ctx.save(); {
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowColor = "#ff6600";

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.font = font;
            ctx.fillStyle = "#fc0";
            ctx.fillText(text, x, y);
        } ctx.restore();

        ctx.save(); {
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            ctx.shadowColor = "black";
            ctx.shadowBlur = 2;

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.font = font;
            ctx.fillStyle = "#fc0";
            ctx.fillText(text, x, y);
        } ctx.restore();
    }
    public render() {
        let width = this.canvas.width;
        let height = this.canvas.height;
        let centerX = width / 2;
        let centerY = height / 2;

        this.drawRoundRect("rgba(0, 0, 0, 0.6)", 50, 50, width - 100, height - 100);
        this.drawTitle("Wing War", "bold 128px 'Racing Sans One'", centerX, centerY - height / 4);
    }
}