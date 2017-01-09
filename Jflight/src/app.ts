///<reference path="./Helpers/CameraHelper.ts" />
///<reference path="THREEx.KeyboardState.ts" />
///<reference path="THREEx.WindowResize.ts" />
///<reference path="Jflight.ts" />
///<reference path="HUD.ts" />

///<reference path="./Sky/SkyShader.ts" />
///<reference path="./Sky/Cloud.ts" />
///<reference path="./Terrain/Sea.ts" />

// main
// グローバル変数
declare interface Promise<T> {
    finally<U>(onFinally?: () => U | Promise<U>): Promise<U>;
}

namespace Main {
    "use strict";

    let flight: Jflight;

    /* canvas要素のノードオブジェクト */

    let canvas: HTMLCanvasElement;

    // standard global variables
    var container: HTMLDivElement;
    var scene: THREE.Scene;
    export var camera: THREE.PerspectiveCamera;

    export var renderer: THREE.WebGLRenderer;

    var mouseX: number;
    var mouseY: number;

    // var stats: Stats;
    var clock = new THREE.Clock();
    // custom global variables
    // var boomer: TextureAnimator; // animators
    // var man: Billboard;
    // var controls: THREE.OrbitControls;

    var cloud: Cloud;

    let light: THREE.HemisphereLight;
    let shadowLight: THREE.DirectionalLight;
    let backLight: THREE.DirectionalLight;

    let sea: Sea;

    export var keyboard = new THREEx.KeyboardState();

    function createLights() {
        light = new THREE.HemisphereLight(0xffffff, 0xb3858c, 0.65);
        light.position.set(0, 0, 10000);

        shadowLight = new THREE.DirectionalLight(0xffe79d, .7);
        shadowLight.position.set(8000, -5000, 12000);
        shadowLight.castShadow = true;
        // shadowLight.shadowDarkness = .3;
        shadowLight.shadowMapWidth = 2048;
        shadowLight.shadowMapHeight = 2048;

        backLight = new THREE.DirectionalLight(0xffffff, .4);
        backLight.position.set(20000, -10000, 10000);
        // backLight.shadowDarkness = .1;
        //backLight.castShadow = true;

        scene.add(backLight);
        scene.add(light);
        scene.add(shadowLight);
    }

    // functions
    export function init(): void {
        canvas = <HTMLCanvasElement>document.getElementById("hud");
        canvas.onmousemove = onMouseMove;
        // scene
        scene = new THREE.Scene();

        // camera
        const SCREEN_WIDTH = window.innerWidth;
        const SCREEN_HEIGHT = window.innerHeight;
        const VIEW_ANGLE: number = 90;
        const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
        const NEAR = 0.1;
        const FAR = 2000000;

        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.z = SCREEN_HEIGHT / 2;
        camera.lookAt(scene.position);

        // RENDERER
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        container = <HTMLDivElement>document.getElementById("view3d");

        container.appendChild(renderer.domElement);

        // EVENTS
        THREEx.WindowResize(renderer, camera);
        // THREEx.FullScreen.bindKey({ charCode: 'm'.charCodeAt(0) });

        // CONTROLS
        // controls = new THREE.OrbitControls(camera, renderer.domElement);
        // STATS

        // stats = new Stats();
        // stats.dom.style.position = 'absolute';
        // stats.dom.style.bottom = '0px';
        // stats.dom.style.zIndex = '100';

        // container.appendChild(stats.dom);



        // LIGHT

        // var light = new THREE.PointLight(0xffffff);

        // light.position.set(0, 250, 0);

        // scene.add(light);



        // var directionalLight = new THREE.DirectionalLight(0xffffff);

        // directionalLight.position.set(0, 0.7, 0.7);

        // scene.add(directionalLight);



        // FLOOR
        // let pitch = new _SoccerPitch(scene);



        // SKYBOX/FOG
        // var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
        // var skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
        // var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);

        // scene.add(skyBox);
        // scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);

        ////////////
        // CUSTOM //
        ////////////

        // GridHelper(大きさ, １マスの大きさ)
        var grid = new THREE.GridHelper(100000, 100);
        grid.rotateX(Math.PI / 2);
        //シーンオブジェクトに追加
        scene.add(grid);

        // 軸の長さ10000
        var axis = new THREE.AxisHelper(10000);
        // sceneに追加
        scene.add(axis);

        // MESHES WITH ANIMATED TEXTURES!


        // man = new Billboard(scene);


        // Add Sky Mesh
        var sky = new Sky();
        scene.add(sky.mesh);

        cloud = new Cloud(scene);

        sea = new Sea(scene);
        if (sea) { }
        // Add Sun Helper
        var sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(20000, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        //sunSphere.position.y = - 700000;
        sunSphere.position.z = - 700000;
        sunSphere.visible = false;
        scene.add(sunSphere);


        /// GUI

        var effectController = {
            turbidity: 10,
            rayleigh: 2,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            luminance: 1,
            inclination: /*0.49*/1, // elevation / inclination
            azimuth: /*0.25*/0.7, // Facing front,
            sun: ! true
        };

        var distance = 400000;

        function guiChanged() {

            var uniforms = sky.uniforms;
            uniforms.turbidity.value = effectController.turbidity;
            uniforms.rayleigh.value = effectController.rayleigh;
            uniforms.luminance.value = effectController.luminance;
            uniforms.mieCoefficient.value = effectController.mieCoefficient;
            uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

            var theta = Math.PI * (effectController.inclination - 0.5);
            var phi = 2 * Math.PI * (effectController.azimuth - 0.5);

            sunSphere.position.x = distance * Math.cos(phi);
            sunSphere.position./*y*/z = distance * Math.sin(phi) * Math.sin(theta);
            sunSphere.position./*z*/y = -distance * Math.sin(phi) * Math.cos(theta);

            sunSphere.visible = effectController.sun;

            sky.uniforms.sunPosition.value.copy(sunSphere.position);

            renderer.render(scene, camera);

        }

        var gui = new dat.GUI();

        gui.add(effectController, "turbidity", 1.0, 20.0/*, 0.1*/).onChange(guiChanged);
        gui.add(effectController, "rayleigh", 0.0, 4/*, 0.001*/).onChange(guiChanged);
        gui.add(effectController, "mieCoefficient", 0.0, 0.1/*, 0.001*/).onChange(guiChanged);
        gui.add(effectController, "mieDirectionalG", 0.0, 1/*, 0.001*/).onChange(guiChanged);
        gui.add(effectController, "luminance", 0.0, 2).onChange(guiChanged);
        gui.add(effectController, "inclination", 0, 1/*, 0.0001*/).onChange(guiChanged);
        gui.add(effectController, "azimuth", 0, 1/*, 0.0001*/).onChange(guiChanged);
        gui.add(effectController, "sun").onChange(guiChanged);

        guiChanged();
        // var explosionTexture = new THREE.TextureLoader().load('images/explosion.jpg');

        // boomer = new TextureAnimator(explosionTexture, 4, 4, 16, 55); // texture, #horiz, #vert, #total, duration.

        // var explosionMaterial = new THREE.MeshBasicMaterial({ map: explosionTexture });

        flight = new Jflight(scene, canvas);

        createLights();
    }

    function onMouseMove(ev: MouseEvent) {
        var rect = canvas.getBoundingClientRect();//ev.target.getBoundingClientRect();
        mouseX = ev.clientX - rect.left;
        mouseY = ev.clientY - rect.top;

        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;

        Jflight.mouseX = mouseX - centerX;
        Jflight.mouseY = mouseY - centerY;

        let radius = centerY * 0.8;
        if (Math.sqrt(Jflight.mouseX ** 2 + Jflight.mouseY ** 2) > radius) {
            let l = Math.sqrt(Jflight.mouseX ** 2 + Jflight.mouseY ** 2);
            Jflight.mouseX /= l; // mouseX - centerX;
            Jflight.mouseY /= l; // mouseY - centerY;
            Jflight.mouseX *= radius;
            Jflight.mouseY *= radius;
        }
        Jflight.mouseX /= radius;
        Jflight.mouseY /= radius;
        flight.isMouseMove = true;
    }

    export function animate() {
        requestAnimationFrame(animate);

        // 
        update();
        render();
    }

    function update() {

        var delta = clock.getDelta();
        delta = 0;
        // Jflight.DT = delta;
        /* 2Dコンテキスト */

        //let context = canvas.getContext("2d");
        flight.run();
        // boomer.update(1000 * delta);

        // man.update(1000 * delta);
        // if (keyboard.pressed("z")) {
        // do something
        // }

        // controls.update();
        // stats.update();
        // man.quaternion(camera.quaternion);

        camera.setRotationFromMatrix(CameraHelper.worldToView(flight.plane[0].matrix));

        camera.position.copy(flight.plane[0].position);

        flight.plane[1].line.position.set(flight.plane[1].position.x, flight.plane[1].position.y, flight.plane[1].position.z);
        flight.plane[2].line.position.set(flight.plane[2].position.x, flight.plane[2].position.y, flight.plane[2].position.z);
        flight.plane[3].line.position.set(flight.plane[3].position.x, flight.plane[3].position.y, flight.plane[3].position.z);


        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        //flight.setWidth(window.innerWidth);
        //flight.setHeight(window.innerHeight);

        sea.update();
    }

    function render() {
        renderer.render(scene, camera);
        let context = canvas.getContext("2d");
        if (context) {
            flight.render(context);
        }
    }
}

Main.init();
Main.animate();
