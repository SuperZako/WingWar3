﻿class PhysicsState {
    public position = new THREE.Vector3();  // 位置（ワールド座標系）
    public velocity = new THREE.Vector3();  // 速度[m/s]（ワールド座標系）

    public rotation = new THREE.Euler(); // オイラー角

    public constructor() {
    }
}