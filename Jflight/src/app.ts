///<reference path="./Camera.ts" />
///<reference path="THREEx.KeyboardState.ts" />
///<reference path="MouseState.ts" />
///<reference path="THREEx.WindowResize.ts" />
///<reference path="Game.ts" />
///<reference path="./Screen/HUD.ts" />

///<reference path="./Sky/SkyShader.ts" />
///<reference path="./Sky/Cloud.ts" />
///<reference path="./Terrain/Sea.ts" />
///<reference path="./Terrain/Ground.ts" />

// main
// グローバル変数
declare interface Promise<T> {
    finally<U>(onFinally?: () => U | Promise<U>): Promise<U>;
}

namespace Main {
    "use strict";

    let flight: Game;

    /* canvas要素のノードオブジェクト */

    let canvas: HTMLCanvasElement;

    // standard global variables
    var container: HTMLDivElement;
    var scene: THREE.Scene;
    export var camera: Camera;//THREE.PerspectiveCamera;

    export var renderer: THREE.WebGLRenderer;

    // var stats: Stats;
    var clock = new THREE.Clock();
    // custom global variables
    // var boomer: TextureAnimator; // animators
    // var man: Billboard;
    // var controls: THREE.OrbitControls;

    var cloud: Cloud;

    //let light: THREE.HemisphereLight;
    //let shadowLight: THREE.DirectionalLight;
    //let backLight: THREE.DirectionalLight;
    //let ambientLight: THREE.AmbientLight;
    let directionalLight: THREE.DirectionalLight;

    let sea: Sea;
    export var keyboard = new THREEx.KeyboardState();
    let mouse: MouseState;
    function createLights() {
        // ambientLight = new THREE.AmbientLight(0xffffff);
        /// scene.add(ambientLight);

        // skyColorHex : 0xffffff, groundColorHex : 0xffffff, intensity : 0.6
        var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);

        //シーンオブジェクトに追加            
        scene.add(hemiLight);


        directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(0, 0, 1000);
        directionalLight.target.position.set(0, 0, 0);
        directionalLight.castShadow = true;

        directionalLight.shadowMapHeight = 2 ** 12;
        directionalLight.shadowMapWidth = 2 ** 12;
        directionalLight.shadowCameraNear = 1;
        directionalLight.shadowCameraFar = 4000;
        directionalLight.shadowCameraLeft = -4000;
        directionalLight.shadowCameraRight = 4000;
        directionalLight.shadowCameraTop = 4000;
        directionalLight.shadowCameraBottom = -4000;

        var helper = new THREE.DirectionalLightHelper(directionalLight, 5);
        var cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
        scene.add(helper);
        scene.add(cameraHelper);
        scene.add(directionalLight);
    }

    // functions
    export function init(): void {
        canvas = <HTMLCanvasElement>document.getElementById("hud");

        mouse = new MouseState(canvas);

        // scene
        scene = new THREE.Scene();

        // camera
        //const SCREEN_WIDTH = window.innerWidth;
        //const SCREEN_HEIGHT = window.innerHeight;
        //const VIEW_ANGLE: number = 90;
        //const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
        //const NEAR = 0.1;
        //const FAR = 2000000;

        //camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        //scene.add(camera);
        //camera.position.z = SCREEN_HEIGHT / 2;
        //camera.lookAt(scene.position);
        camera = new Camera(scene);

        // RENDERER
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;


        container = <HTMLDivElement>document.getElementById("view3d");

        container.appendChild(renderer.domElement);

        // EVENTS
        THREEx.WindowResize(renderer, camera.getCamera());
        // THREEx.FullScreen.bindKey({ charCode: 'm'.charCodeAt(0) });

        // CONTROLS
        // controls = new THREE.OrbitControls(camera, renderer.domElement);
        // STATS

        // stats = new Stats();
        // stats.dom.style.position = 'absolute';
        // stats.dom.style.bottom = '0px';
        // stats.dom.style.zIndex = '100';

        // container.appendChild(stats.dom);

        ////////////
        // CUSTOM //
        ////////////

        // GridHelper(大きさ, １マスの大きさ)
        //var grid = new THREE.GridHelper(100000, 100);
        //grid.rotateX(Math.PI / 2);
        ////シーンオブジェクトに追加
        //scene.add(grid);

        //// 軸の長さ10000
        //var axis = new THREE.AxisHelper(10000);
        //// sceneに追加
        //scene.add(axis);

        // MESHES WITH ANIMATED TEXTURES!


        // man = new Billboard(scene);


        // Add Sky Mesh
        var sky = new Sky();
        scene.add(sky.mesh);

        cloud = new Cloud(scene);

        sea = new Sea(scene);

        let ground = new Ground(scene, "../models/ground.json");
        if (ground) { }
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



        createLights();


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

            // directionalLight.position.copy(sunSphere.position);

            sunSphere.visible = effectController.sun;

            sky.uniforms.sunPosition.value.copy(sunSphere.position);

            renderer.render(scene, camera.getCamera());

        }

        var gui = new dat.GUI({ autoPlace: false });
        let customContainer = document.getElementById('gui-container');

        if (customContainer) {
            customContainer.appendChild(gui.domElement);
        }

        let skyFolder = gui.addFolder('Sky');
        skyFolder.add(effectController, "turbidity", 1.0, 20.0/*, 0.1*/).onChange(guiChanged);
        skyFolder.add(effectController, "rayleigh", 0.0, 4/*, 0.001*/).onChange(guiChanged);
        skyFolder.add(effectController, "mieCoefficient", 0.0, 0.1/*, 0.001*/).onChange(guiChanged);
        skyFolder.add(effectController, "mieDirectionalG", 0.0, 1/*, 0.001*/).onChange(guiChanged);
        skyFolder.add(effectController, "luminance", 0.0, 2).onChange(guiChanged);
        skyFolder.add(effectController, "inclination", 0, 1/*, 0.0001*/).onChange(guiChanged);
        skyFolder.add(effectController, "azimuth", 0, 1/*, 0.0001*/).onChange(guiChanged);
        skyFolder.add(effectController, "sun").onChange(guiChanged);

        guiChanged();



        // var explosionTexture = new THREE.TextureLoader().load('images/explosion.jpg');

        // boomer = new TextureAnimator(explosionTexture, 4, 4, 16, 55); // texture, #horiz, #vert, #total, duration.

        // var explosionMaterial = new THREE.MeshBasicMaterial({ map: explosionTexture });

        flight = new Game(scene, canvas);
        camera.setTarget(flight.plane[0]);
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
        flight.run();
        camera.update();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    function render() {
        renderer.render(scene, camera.getCamera());
        flight.render();
    }
}
Main.init();
Main.animate();
