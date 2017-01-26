


class MouseState {
    private x: number;
    private y: number;

    public constructor(private domElement: Node = document) {
        // bind keyEvents
        this.domElement.addEventListener("onmousemove", this.onMouseMove, false);
    }


    private onMouseMove = (ev: MouseEvent) => {
        let target = <HTMLElement>ev.target;
        let rect = target.getBoundingClientRect();
        this.x = ev.clientX - rect.left;
        this.y = ev.clientY - rect.top;
    }
}