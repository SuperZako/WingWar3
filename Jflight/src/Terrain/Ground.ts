

class Ground {

    public constructor(scene: THREE.Scene, _url: string) {
        //オブジェクト
        //let loader = new THREE.JSONLoader();
        //loader.load(url, (geometry, materials) => { //第１引数はジオメトリー、第２引数はマテリアルが自動的に取得
        //    var faceMaterial = new THREE.MeshFaceMaterial(materials);
        //    let mesh = new THREE.Mesh(geometry, faceMaterial);
        //    // json.position.set(0, 100, 0);
        //    mesh.scale.set(1000, 1000, 1000);
        //    mesh.rotation.x = Math.PI / 2;
        //    scene.add(mesh);
        //});

        var geometry = new THREE.PlaneGeometry(10000, 10000);
        var material = new THREE.MeshPhongMaterial ({ color: 0x008000, side: THREE.DoubleSide});
        var plane = new THREE.Mesh(geometry, material);
        plane.receiveShadow  = true;
        plane.position.set(0, 0, 0.1);
        scene.add(plane);
    }
}