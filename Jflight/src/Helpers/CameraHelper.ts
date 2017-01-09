namespace CameraHelper {
    let xAxis = new THREE.Vector3();
    let yAxis = new THREE.Vector3();
    let zAxis = new THREE.Vector3();

    let vector = new THREE.Vector3();

    let result = new THREE.Matrix4();


    //     機体座標系
    //           Z
    //           ^  X
    //           | /
    //           |/
    //     Y<----

    //     ワールド座標系
    //     Z
    //     ^  Y
    //     | /
    //     |/
    //     -------->X

    export function worldToView(world: THREE.Matrix4) {
        result.copy(world);
        result.transpose();

        result.extractBasis(xAxis, yAxis, zAxis);
        result.identity();
        result.makeBasis(xAxis, zAxis, yAxis.negate());

        return result;
    }

    //export function toScreenPosition(obj: THREE.Object3D, camera: THREE.Camera) {
    //    var vector = new THREE.Vector3();

    //    var widthHalf = 0.5 * Main.renderer.context.canvas.width;
    //    var heightHalf = 0.5 * Main.renderer.context.canvas.height;

    //    obj.updateMatrixWorld(true);
    //    vector.setFromMatrixPosition(obj.matrixWorld);
    //    vector.project(camera);

    //    vector.x = (vector.x * widthHalf) + widthHalf;
    //    vector.y = - (vector.y * heightHalf) + heightHalf;

    //    return {
    //        x: vector.x,
    //        y: vector.y
    //    };
    //}

    export function toScreenPosition(position: THREE.Vector3, camera: THREE.Camera) {
        var widthHalf = 0.5 * Main.renderer.context.canvas.width;
        var heightHalf = 0.5 * Main.renderer.context.canvas.height;
        vector.copy(position);
        vector.project(camera);

        vector.x = (vector.x * widthHalf) + widthHalf;
        vector.y = - (vector.y * heightHalf) + heightHalf;

        return {
            x: vector.x,
            y: vector.y
        };
    }
}