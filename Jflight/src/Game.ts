///<reference path="./common/FSM/StateMachine.ts" />
///<reference path="./common/FSM/State.ts" />

///<reference path="Plane.ts" />

//
// Jflight�N���X
//
// jflight�p�̃A�v���b�g�N���X
// ���̃N���X��jflight���s�̋N�_
// Applet3D����p�����邱�Ƃ�3D�\������Ƌ��ɁA
// Runnable�C���^�[�t�F�C�X�p���ŃX���b�h��p����
//


//     �@�̍��W�n
//           Z
//           ^  X
//           | /
//           |/
//     Y<----

//     ���[���h���W�n
//     Z
//     ^  Y
//     | /
//     |/
//     -------->X


class Game {

    // �萔�錾
    static PMAX = 4;          // �@�̂̍ő吔
    static readonly G = -9.8;       // �d�͉����x
    public static DT = 0.05;       // �v�Z�X�e�b�v��

    // �ϐ�
    public plane: Plane[] = [];                      // �e�@�̃I�u�W�F�N�g�ւ̔z��
    protected autoFlight = true;          // ���@�iplane[0]�j���������c�ɂ���̂�

    private screen: _Screen;


    static mouseX: number;
    static mouseY: number;

    isMouseMove = false;

    private stateMachine: StateMachine<Game>;

    public constructor(scene: THREE.Scene, canvas: HTMLCanvasElement) {
        // super();
        //set up the state machine

        this.stateMachine = new StateMachine<Game>(this);


        // �s�v�ȃK�[�x�b�W�R���N�V����������邽�߂ɁA
        // �I�u�W�F�N�g�����߂ɏo���邾������Ă���
        for (let i = 0; i < Game.PMAX; i++) {
            this.plane.push(new Plane(scene));
        }

        this.screen = new TitleScene(canvas);//new HUD(hudCanvas, this.plane[0], this);

        // �e�@�̂̐ݒ�
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


    // ��ʕ\��
    public draw() {
        // ���@�̕ϊ��s���O�̂��ߍČv�Z���Ă���
        this.plane[0].checkTrans();

        // HUD�\��
        this.screen.render();
    }

    // ���C�����[�v

    public run() {
        let keyboard = Main.keyboard;
        // �X�y�[�X�L�[�������ꂽ�玩�����cOFF
        if (keyboard.pressed("space")) {
            this.autoFlight = false;
        }

        // �e�@���ړ�
        this.plane[0].move(this, this.autoFlight);
        for (let i = 1; i < Game.PMAX; i++) {
            this.plane[i].move(this, true);
        }
    }

    public render() {
        // �J�����ʒu�����@�ɃZ�b�g���ĕ\��
        // this.camerapos.set(this.plane[0].position.x, this.plane[0].position.y, this.plane[0].position.z);
        this.draw();
    }
    // �e�@�̂�\��
    // �e�ۂ�~�T�C���������ŕ\�����Ă���

    writePlane(_context: CanvasRenderingContext2D) {
        //let s0 = new THREE.Vector3();
        //let s1 = new THREE.Vector3();
        //let s2 = new THREE.Vector3();

        //for (let i = 0; i < Jflight.PMAX; i++) {
        //    if (this.plane[i].use) {

        //        this.writeGun(context, this.plane[i]);
        //        this.writeAam(context, this.plane[i]);

        //        //���@�ȊO�̋@�̂�\��

        //        // �e�@�̂̃��[�N�p���W�ϊ��s����Čv�Z
        //        //this.plane[0].checkTransM(this.plane[i].aVel);
        //        let a = new THREE.Euler(this.plane[i].rotation.x, -this.plane[i].rotation.y, this.plane[i].rotation.z, 'YXZ');
        //        let m = new THREE.Matrix4();
        //        m.makeRotationFromEuler(a);
        //        m.transpose();
        //        if (i !== 0) {
        //            for (let j = 0; j < 19; j++) {

        //                // �e�@�̃��[�J�����W���烏�[���h���W�ɕϊ�
        //                // ���{���̓A�t�B���ϊ��ł܂Ƃ߂ĕϊ�����ׂ�
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

        //                // ���[���h���W���A�X�N���[�����W�ɕϊ�
        //                this.change3d(this.plane[0], p0, s0);
        //                this.change3d(this.plane[0], p1, s1);
        //                this.change3d(this.plane[0], p2, s2);

        //                // �O�p�`�\��
        //                this.drawPoly(context, s0, s1, s2);
        //            }
        //        }
        //    }
        //}
    }

    // �@�e��\��

    protected writeGun(_context: CanvasRenderingContext2D, _aplane: Plane) {
        //let dm = new THREE.Vector3();
        //let dm2 = new THREE.Vector3();
        //let cp = new THREE.Vector3();

        //for (let j = 0; j < Plane.BMAX; j++) {
        //    let bp = aplane.bullets[j];

        //    // use�J�E���^��0���傫�����̂̂ݕ\��
        //    if (bp.use > 0) {

        //        // �e�ۂ̈ʒu�Ƃ��̑��x���烉�C����\��

        //        // �X�N���[���ɋ߂��ꍇ�A���������\��
        //        if (cp.z < 400) {

        //            // 0.005�b��`0.04�b��̒e�ۈʒu�����C���\��
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

        //        // ���݈ʒu�`0.05�b��̒e�ۈʒu�����C���\��
        //        this.change3d(this.plane[0], bp.position, cp);
        //        dm.x = bp.position.x + bp.velocity.x * 0.05;
        //        dm.y = bp.position.y + bp.velocity.y * 0.05;
        //        dm.z = bp.position.z + bp.velocity.z * 0.05;
        //        this.change3d(this.plane[0], dm, dm2);
        //        this.drawBlined(context, cp, dm2);
        //    }

        //    // �e�ۂ��������̏ꍇ�A���~�\��
        //    if (bp.bom > 0) {
        //        this.change3d(this.plane[0], <any>bp.oldPosition, cp);
        //        this.fillBarc(cp);
        //        bp.bom--;
        //    }
        //}
    }

    // �~�T�C���Ƃ��̉���\��

    protected writeAam(_context: CanvasRenderingContext2D, _aplane: Plane) {
        //let dm = new THREE.Vector3();
        //let cp = new THREE.Vector3();
        //for (let j = 0; j < Plane.MMMAX; j++) {
        //    let ap = aplane.aam[j];

        //    // use�J�E���^��0���傫�����̂̂ݕ\��
        //    if (ap.use >= 0) {

        //        // �~�T�C�����������łȂ���΁A�~�T�C���{�̂�\��
        //        if (ap.bom <= 0) {
        //            dm.x = ap.position.x + ap.forward.x * 4;
        //            dm.y = ap.position.y + ap.forward.y * 4;
        //            dm.z = ap.position.z + ap.forward.z * 4;
        //            this.change3d(this.plane[0], dm, cp);
        //            this.change3d(this.plane[0], <any>ap.position, dm);
        //            this.drawAline(cp, dm);
        //        }

        //        // �~�T�C���̉���\��
        //        // ���̍��W�̓����O�o�b�t�@�Ɋi�[����Ă���
        //        let k = (ap.use + Missile.MOMAX + 1) % Missile.MOMAX;
        //        this.change3d(this.plane[0], <any>ap.oldPositions[k], dm);
        //        for (let m = 0; m < ap.count; m++) {
        //            this.change3d(this.plane[0], <any>ap.oldPositions[k], cp);
        //            this.drawMline(context, dm, cp);
        //            k = (k + Missile.MOMAX + 1) % Missile.MOMAX;
        //            dm.set(cp.x, cp.y, cp.z);
        //        }
        //    }

        //    // �~�T�C�����������̏ꍇ�A���~�\��
        //    if (ap.bom > 0) {
        //        this.change3d(this.plane[0], <any>ap.position, cp);
        //        this.fillBarc(cp);
        //    }
        //}
    }

    // �n�ʂ�\��

    writeGround(_context: CanvasRenderingContext2D) {

        //let mx, my;
        //let i: number, j: number;
        //let p = new THREE.Vector3();

        //// �n�ʃO���b�h�̑傫�����v�Z

        //let step = Jflight.FMAX * 2 / Jflight.GSCALE;

        //// ���@�̃O���b�h�ʒu�ƃI�t�Z�b�g���v�Z

        //let dx = (this.plane[0].position.x / step);
        //let dy = (this.plane[0].position.y / step);
        //let sx = dx * step;
        //let sy = dy * step;

        //// �e�O���b�h�_���X�N���[�����W�ɕϊ�
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

        //// �����i�q��\��
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

    // �n�ʂ̍������v�Z

    public gHeight(_px: number, _py: number) {
        return 0;
    }

    // �n�ʂ̌X�����v�Z

    public gGrad(_px: number, _py: number, p: THREE.Vector3) {
        p.x = 0;
        p.y = 0;
    }

}
