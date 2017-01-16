

class Sea {
    private geometry: THREE.BoxGeometry;
    private mesh: THREE.Mesh;
    //private wave: number[] = [];
    //private tick = 0;
    public constructor(scene: THREE.Scene) {
        var waterGeo = new THREE.BoxGeometry(1000000, 1000000, 100);//, 100, 100);
        //for (var i = 0; i < waterGeo.vertices.length; i++) {
        //    var vertex = waterGeo.vertices[i];
        //    if (vertex.z > 0) {
        //        vertex.z += MathHelper.randInRange(-100, 100);
        //    }
        //    vertex.x += MathHelper.randInRange(-250, 250);
        //    vertex.y += MathHelper.randInRange(-250, 250);

        //    this.wave.push(MathHelper.randInRange(0, 100));
        //}

        //waterGeo.computeFaceNormals();
        //waterGeo.computeVertexNormals();

        this.geometry = waterGeo;

        let mesh = new THREE.Mesh(waterGeo, new THREE.MeshLambertMaterial({
            color: 0x6092c1,
            shading: THREE.FlatShading,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide,
        }));

        mesh.position.set(0, 0, -100);
        this.mesh = mesh;

        mesh.receiveShadow = true;

        scene.add(mesh);
    }
}