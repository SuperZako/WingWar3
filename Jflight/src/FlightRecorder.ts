class FlightRecorder {
    private positions: THREE.Vector3[] = [];
    private matrices: THREE.Matrix4[] = [];

    public push(position: THREE.Vector3, matrix: THREE.Matrix4) {
        this.positions.push(position.clone());
        this.matrices.push(matrix.clone());

        if (this.positions.length > 100) {
            this.positions.shift();
            this.matrices.shift();
        }
    }

    public tail(n = 0) {
        if (this.positions.length - (n + 1) >= 0) {
            return {
                position: this.positions[this.positions.length - (n + 1)],
                matrix: this.matrices[this.positions.length - (n + 1)]
            };
        }
        return null;
    }
}