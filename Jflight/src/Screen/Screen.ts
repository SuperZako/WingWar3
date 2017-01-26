abstract class _Screen {
    protected context: CanvasRenderingContext2D;
    public constructor(protected canvas: HTMLCanvasElement) {
        let context = canvas.getContext("2d");

        if (context) {
            this.context = context;
        }
    }

    protected drawLine(strokeStyle: string, x1: number, y1: number, x2: number, y2: number) {
        let ctx = this.context;
        ctx.save(); {

            ctx.strokeStyle = strokeStyle;
            //描画することを宣言する
            ctx.beginPath();
            //描き始め（始点）を決定する
            ctx.moveTo(x1, y1);
            //始点から指定の座標まで線を引く
            ctx.lineTo(x2, y2);
            //引き続き線を引いていく
            //context.lineTo(0, 100);
            //context.lineTo(51, 15);
            //描画を終了する
            ctx.closePath();

            //上記記述は定義情報である。この命令で線を描く。
            ctx.stroke();
        } ctx.restore();
    }

    protected drawCircle(strokeStyle: string, centerX: number, centerY: number, radius: number) {
        let ctx = this.context;
        ctx.save(); {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            //context.fillStyle = 'green';
            //context.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = strokeStyle;
            ctx.stroke();
        } ctx.restore();
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
        let ctx = this.context;
        ctx.save(); {
            ctx.strokeStyle = strokeStyle;
            ctx.strokeRect(x, y, w, h);
        } ctx.restore();
    }
    public drawRoundRect(style: string, x: number, y: number, width: number, height: number, radius = 5, stroke = false) {
        let ctx = this.context;
        //if (typeof stroke == 'undefined') {
        //    stroke = true;
        //}
        //if (typeof radius === 'undefined') {
        //    radius = 5;
        //}
        //if (typeof radius === 'number') {
        //    radius = { tl: radius, tr: radius, br: radius, bl: radius };
        //} else {
        //    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        //    for (var side in defaultRadius) {
        //        radius[side] = radius[side] || defaultRadius[side];
        //    }
        //}
        let tl = radius;
        let tr = radius;
        let br = radius;
        let bl = radius;

        ctx.save(); {
            ctx.beginPath();
            ctx.moveTo(x + tl, y);
            ctx.lineTo(x + width - tr, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
            ctx.lineTo(x + width, y + height - br);
            ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
            ctx.lineTo(x + bl, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
            ctx.lineTo(x, y + tl);
            ctx.quadraticCurveTo(x, y, x + tl, y);
            ctx.closePath();
            //if (fill) {
            //    ctx.fill();
            //}
            if (stroke) {
                ctx.stroke();
            } else {
                ctx.fillStyle = style;
                ctx.fill();
            }
        } ctx.restore();
    }
    abstract render(): void;
}