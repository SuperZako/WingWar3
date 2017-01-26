///<reference path="./common/FSM/StateMachine.ts" />
///<reference path="./common/FSM/State.ts" />

///<reference path="Plane.ts" />

//
// Jflightクラス
//
// jflight用のアプレットクラス
// このクラスがjflight実行の起点
// Applet3Dから継承することで3D表示すると共に、
// Runnableインターフェイス継承でスレッドを用いる
//


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


class Game {

    // 定数宣言
    static PMAX = 4;          // 機体の最大数
    static readonly G = -9.8;       // 重力加速度
    public static DT = 0.05;       // 計算ステップ幅

    // 変数
    public plane: Plane[] = [];                      // 各機体オブジェクトへの配列
    protected autoFlight = true;          // 自機（plane[0]）を自動操縦にするのか

    private screen: _Screen;


    static mouseX: number;
    static mouseY: number;

    isMouseMove = false;

    private stateMachine: StateMachine<Game>;

    public constructor(scene: THREE.Scene, canvas: HTMLCanvasElement) {
        // super();
        //set up the state machine

        this.stateMachine = new StateMachine<Game>(this);


        // 不要なガーベッジコレクションを避けるために、
        // オブジェクトを初めに出来るだけ作っておく
        for (let i = 0; i < Game.PMAX; i++) {
            this.plane.push(new Plane(scene));
        }

        this.screen = new TitleScene(canvas);//new HUD(hudCanvas, this.plane[0], this);

        // 各機体の設定
        this.plane[0].no = 0;
        this.plane[1].no = 1;
        this.plane[2].no = 2;
        this.plane[3].no = 3;
        this.plane[0].target = 2;
        this.plane[1].target = 2;
        this.plane[2].target = 1;
        this.plane[3].target = 1;
        this.plane[0].use = true;
        this.plane[1].use = true;
        this.plane[2].use = true;
        this.plane[3].use = true;
        this.plane[0].level = 20;
        this.plane[1].level = 10;
        this.plane[2].level = 20;
        this.plane[3].level = 30;
    }


    // 画面表示
    public draw() {
        // 自機の変換行列を念のため再計算しておく
        this.plane[0].checkTrans();

        // HUD表示
        this.screen.render();
    }

    // メインループ

    public run() {
        let keyboard = Main.keyboard;
        // スペースキーが押されたら自動操縦OFF
        if (keyboard.pressed("space")) {
            this.autoFlight = false;
        }

        // 各機を移動
        this.plane[0].move(this, this.autoFlight);
        for (let i = 1; i < Game.PMAX; i++) {
            this.plane[i].move(this, true);
        }
    }

    public render() {
        // カメラ位置を自機にセットして表示
        // this.camerapos.set(this.plane[0].position.x, this.plane[0].position.y, this.plane[0].position.z);
        this.draw();
    }
    // 各機体を表示
    // 弾丸やミサイルもここで表示している

    writePlane(_context: CanvasRenderingContext2D) {
        //let s0 = new THREE.Vector3();
        //let s1 = new THREE.Vector3();
        //let s2 = new THREE.Vector3();

        //for (let i = 0; i < Jflight.PMAX; i++) {
        //    if (this.plane[i].use) {

        //        this.writeGun(context, this.plane[i]);
        //        this.writeAam(context, this.plane[i]);

        //        //自機以外の機体を表示

        //        // 各機体のワーク用座標変換行列を再計算
        //        //this.plane[0].checkTransM(this.plane[i].aVel);
        //        let a = new THREE.Euler(this.plane[i].rotation.x, -this.plane[i].rotation.y, this.plane[i].rotation.z, 'YXZ');
        //        let m = new THREE.Matrix4();
        //        m.makeRotationFromEuler(a);
        //        m.transpose();
        //        if (i !== 0) {
        //            for (let j = 0; j < 19; j++) {

        //                // 各機のローカル座標からワールド座標に変換
        //                // ＃本当はアフィン変換でまとめて変換するべし
        //                // this.plane[0].change_ml2w(Jflight.obj[j][0], p0);
        //                let p0 = Jflight.obj[j][0].clone();
        //                p0.applyMatrix4(m);

        //                // this.plane[0].change_ml2w(Jflight.obj[j][1], p1);
        //                let p1 = Jflight.obj[j][1].clone();
        //                p1.applyMatrix4(m);

        //                // this.plane[0].change_ml2w(Jflight.obj[j][2], p2);
        //                let p2 = Jflight.obj[j][2].clone();
        //                p2.applyMatrix4(m);

        //                p0.add(this.plane[i].position);
        //                p1.add(this.plane[i].position);
        //                p2.add(this.plane[i].position);

        //                // ワールド座標を、スクリーン座標に変換
        //                this.change3d(this.plane[0], p0, s0);
        //                this.change3d(this.plane[0], p1, s1);
        //                this.change3d(this.plane[0], p2, s2);

        //                // 三角形表示
        //                this.drawPoly(context, s0, s1, s2);
        //            }
        //        }
        //    }
        //}
    }

    // 機銃を表示

    protected writeGun(_context: CanvasRenderingContext2D, _aplane: Plane) {
        //let dm = new THREE.Vector3();
        //let dm2 = new THREE.Vector3();
        //let cp = new THREE.Vector3();

        //for (let j = 0; j < Plane.BMAX; j++) {
        //    let bp = aplane.bullets[j];

        //    // useカウンタが0より大きいもののみ表示
        //    if (bp.use > 0) {

        //        // 弾丸の位置とその速度からラインを表示

        //        // スクリーンに近い場合、太線部も表示
        //        if (cp.z < 400) {

        //            // 0.005秒後～0.04秒後の弾丸位置をライン表示
        //            dm.x = bp.position.x + bp.velocity.x * 0.005;
        //            dm.y = bp.position.y + bp.velocity.y * 0.005;
        //            dm.z = bp.position.z + bp.velocity.z * 0.005;
        //            this.change3d(this.plane[0], dm, cp);
        //            dm.x = bp.position.x + bp.velocity.x * 0.04;
        //            dm.y = bp.position.y + bp.velocity.y * 0.04;
        //            dm.z = bp.position.z + bp.velocity.z * 0.04;
        //            this.change3d(this.plane[0], dm, dm2);
        //            this.drawBline(context, cp, dm2);
        //        }

        //        // 現在位置～0.05秒後の弾丸位置をライン表示
        //        this.change3d(this.plane[0], bp.position, cp);
        //        dm.x = bp.position.x + bp.velocity.x * 0.05;
        //        dm.y = bp.position.y + bp.velocity.y * 0.05;
        //        dm.z = bp.position.z + bp.velocity.z * 0.05;
        //        this.change3d(this.plane[0], dm, dm2);
        //        this.drawBlined(context, cp, dm2);
        //    }

        //    // 弾丸が爆発中の場合、爆円表示
        //    if (bp.bom > 0) {
        //        this.change3d(this.plane[0], <any>bp.oldPosition, cp);
        //        this.fillBarc(cp);
        //        bp.bom--;
        //    }
        //}
    }

    // ミサイルとその煙を表示

    protected writeAam(_context: CanvasRenderingContext2D, _aplane: Plane) {
        //let dm = new THREE.Vector3();
        //let cp = new THREE.Vector3();
        //for (let j = 0; j < Plane.MMMAX; j++) {
        //    let ap = aplane.aam[j];

        //    // useカウンタが0より大きいもののみ表示
        //    if (ap.use >= 0) {

        //        // ミサイルが爆発中でなければ、ミサイル本体を表示
        //        if (ap.bom <= 0) {
        //            dm.x = ap.position.x + ap.forward.x * 4;
        //            dm.y = ap.position.y + ap.forward.y * 4;
        //            dm.z = ap.position.z + ap.forward.z * 4;
        //            this.change3d(this.plane[0], dm, cp);
        //            this.change3d(this.plane[0], <any>ap.position, dm);
        //            this.drawAline(cp, dm);
        //        }

        //        // ミサイルの煙を表示
        //        // 煙の座標はリングバッファに格納されている
        //        let k = (ap.use + Missile.MOMAX + 1) % Missile.MOMAX;
        //        this.change3d(this.plane[0], <any>ap.oldPositions[k], dm);
        //        for (let m = 0; m < ap.count; m++) {
        //            this.change3d(this.plane[0], <any>ap.oldPositions[k], cp);
        //            this.drawMline(context, dm, cp);
        //            k = (k + Missile.MOMAX + 1) % Missile.MOMAX;
        //            dm.set(cp.x, cp.y, cp.z);
        //        }
        //    }

        //    // ミサイルが爆発中の場合、爆円表示
        //    if (ap.bom > 0) {
        //        this.change3d(this.plane[0], <any>ap.position, cp);
        //        this.fillBarc(cp);
        //    }
        //}
    }

    // 地面を表示

    writeGround(_context: CanvasRenderingContext2D) {

        //let mx, my;
        //let i: number, j: number;
        //let p = new THREE.Vector3();

        //// 地面グリッドの大きさを計算

        //let step = Jflight.FMAX * 2 / Jflight.GSCALE;

        //// 自機のグリッド位置とオフセットを計算

        //let dx = (this.plane[0].position.x / step);
        //let dy = (this.plane[0].position.y / step);
        //let sx = dx * step;
        //let sy = dy * step;

        //// 各グリッド点をスクリーン座標に変換
        //my = -Jflight.FMAX;
        //for (j = 0; j < Jflight.GSCALE; j++) {
        //    mx = -Jflight.FMAX;
        //    for (i = 0; i < Jflight.GSCALE; i++) {
        //        p.x = mx + sx;
        //        p.y = my + sy;
        //        p.z = this.gHeight(mx + sx, my + sy);
        //        this.change3d(this.plane[0], p, this.pos[j][i]);
        //        mx += step;
        //    }
        //    my += step;
        //}

        //// 直交格子を表示
        //for (j = 0; j < Jflight.GSCALE; j++) {
        //    for (i = 0; i < Jflight.GSCALE - 1; i++) {
        //        this.drawSline(context, this.pos[j][i], this.pos[j][i + 1]);
        //    }
        //}
        //for (i = 0; i < Jflight.GSCALE; i++) {
        //    for (j = 0; j < Jflight.GSCALE - 1; j++) {
        //        this.drawSline(context, this.pos[j][i], this.pos[j + 1][i]);
        //    }
        //}
    }

    // 地面の高さを計算

    public gHeight(_px: number, _py: number) {
        return 0;
    }

    // 地面の傾きを計算

    public gGrad(_px: number, _py: number, p: THREE.Vector3) {
        p.x = 0;
        p.y = 0;
    }

}
