class Scene {
    protected context: CanvasRenderingContext2D;
    public constructor(canvas: HTMLCanvasElement) {
        let context = canvas.getContext("2d");

        if (context) {
            this.context = context;
        }
    }
    public render(_context: CanvasRenderingContext2D) {
    }
}