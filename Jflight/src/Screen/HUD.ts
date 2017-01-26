///<reference path="./Screen.ts" />
///<reference path="./TitleScreen.ts" />

class HUD extends _Screen {
    public constructor(canvas: HTMLCanvasElement, private plane: Plane, private world: Game) {
        super(canvas);
    }
    public drawCross(x: number, y: number, length: number) {
        this.drawLine("rgb(255, 255, 255)", x, y - length, x, y + length);
        this.drawLine("rgb(255, 255, 255)", x - length, y, x + length, y);
    }
    public render() {
        let width = this.canvas.width;
        let height = this.canvas.height;
        let centerX = width / 2;
        let centerY = height / 2;

        let context = this.context;
        this.drawCross(centerX, centerY, 15);

        let radius = height / 2 * 0.8;
        this.drawCircle("rgb(255, 255, 255)", centerX, centerY, height / 2 * 0.8);


        this.drawCircle("rgb(255, 255, 255)", centerX + this.plane.stickPos.y * radius, centerY - this.plane.stickPos.x * radius, 10);

        this.drawCircle("rgb(255, 255, 255)", centerX + Game.mouseX, centerY + Game.mouseY, 10);

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

        let t = this.world.plane[this.plane.target].position.clone();
        let u = CameraHelper.toScreenPosition(t, Main.camera.getCamera());

        this.strokeRect("rgb(0, 255, 0)", u.x - 10, u.y - 10, 20, 20);


        //this.currentScene.render();
    }
}