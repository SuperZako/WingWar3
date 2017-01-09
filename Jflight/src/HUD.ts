

class HUD {
    //mouseX: number;
    //mouseY: number;

    private context: CanvasRenderingContext2D;

    public constructor(private canvas: HTMLCanvasElement, private plane: Plane) {
        let context = canvas.getContext("2d");

        if (context) {
            this.context = context;
        }
    }

    private drawLine(strokeStyle: string, x1: number, y1: number, x2: number, y2: number) {
        let context = this.context;
        context.save(); {

            context.strokeStyle = strokeStyle;
            //描画することを宣言する
            context.beginPath();
            //描き始め（始点）を決定する
            context.moveTo(x1, y1);
            //始点から指定の座標まで線を引く
            context.lineTo(x2, y2);
            //引き続き線を引いていく
            //context.lineTo(0, 100);
            //context.lineTo(51, 15);
            //描画を終了する
            context.closePath();

            //上記記述は定義情報である。この命令で線を描く。
            context.stroke();
        } context.restore();
    }

    private drawCircle(context: CanvasRenderingContext2D, strokeStyle: string, centerX: number, centerY: number, radius: number) {
        context.save(); {
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            //context.fillStyle = 'green';
            //context.fill();
            context.lineWidth = 2;
            context.strokeStyle = strokeStyle;
            context.stroke();
        } context.restore();
    }

    public fillText(text: string, font: string, x: number, y: number) {
        let context = this.context;
        context.save(); {
            context.font = font;//"18px 'ＭＳ Ｐゴシック'";
            context.fillStyle = "white";
            context.fillText(text, x, y);
        } context.restore();
    }


    public strokeRect(strokeStyle: string, x: number, y: number, w: number, h: number) {
        let context = this.context;
        context.save(); {
            context.strokeStyle = strokeStyle;
            context.strokeRect(x, y, w, h);
        } context.restore();

    }
    public drawCross(x: number, y: number, length: number) {
        this.drawLine("rgb(255, 255, 255)", x, y - length, x, y + length);
        this.drawLine("rgb(255, 255, 255)", x - length, y, x + length, y);
    }

    public drawTitle(text: string, font: string, x: number, y: number) {
        let ctx = this.context;
        ctx.save(); {
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowColor = "#ff6600";

            ctx.font = font;
            ctx.fillStyle = "#fc0";
            ctx.fillText(text, x, y);
        } ctx.restore();

        ctx.save(); {
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            ctx.shadowColor = "black";
            ctx.shadowBlur = 2;

            ctx.font = font;
            ctx.fillStyle = "#fc0";
            ctx.fillText(text, x, y);
        } ctx.restore();
    }



    public render(world: Jflight) {
        let width = this.canvas.width;
        let height = this.canvas.height;
        let centerX = width / 2;
        let centerY = height / 2;

        let context = this.context;
        this.drawCross(centerX, centerY, 15);

        let radius = height / 2 * 0.8;
        this.drawCircle(context, "rgb(255, 255, 255)", centerX, centerY, height / 2 * 0.8);


        this.drawCircle(context, "rgb(255, 255, 255)", centerX + this.plane.stickPos.y * radius, centerY - this.plane.stickPos.x * radius, 10);

        this.drawCircle(context, "rgb(255, 255, 255)", centerX + Jflight.mouseX, centerY + Jflight.mouseY, 10);

        let y = this.plane.rotation.y;

        context.save(); {
            // Move registration point to the center of the canvas
            context.translate(width / 2, height / 2);

            // Rotate 1 degree
            context.rotate(-y);

            // Move registration point back to the top left corner of canvas
            context.translate(-width / 2, -height / 2);


            let x = -this.plane.rotation.x;
            for (let i = -170; i <= 180; i += 10) {
                // let x = -this.plane[0].aVel.x + (i * Math.PI / 180);
                // let distance = 300;
                this.drawLine("rgb(255, 255, 255)", centerX - 150, centerY + i * 20 + Math.tan(x) * centerY, centerX + 150, centerY + i * 20 + Math.tan(x) * centerY);
            }
        } context.restore();
        this.fillText("Speed=" + this.plane.velocity.length(), "18px 'ＭＳ Ｐゴシック'", 50, 50);

        this.drawTitle("Wing War", "bold 128px 'Racing Sans One'", 50, 50);

        let t = world.plane[this.plane.target].position.clone();
        let u = CameraHelper.toScreenPosition(t, Main.camera);

        this.strokeRect("rgb(0, 255, 0)", u.x - 10, u.y - 10, 20, 20);
    }
}