///<reference path="./Physics/PhysicsState.ts" />
///<reference path="Wing.ts" />
///<reference path="Bullet.ts" />
///<reference path="Missile.ts" />

//
// Plane
// �@�̃N���X
//
// �e�e�ۂ�~�T�C���𓮂����Ă���̂����̃N���X
//

class Plane extends PhysicsState {

    // �萔

    static readonly  BMAX = 20;    // �e�ۂ̍ő吔
    static readonly  MMMAX = 4;    // �~�T�C���̍ő吔
    static readonly  WMAX = 6;     // ���̐�
    static readonly  MAXT = 50;    // �@�e�̍ő剷�x

    // �ϐ�

    // ���[���h���W���@�̍��W�ւ̕ϊ��s��

    protected cosa: number;
    protected cosb: number;
    protected cosc: number;

    protected sina: number;
    protected sinb: number;
    protected sinc: number;

    matrix = new THREE.Matrix4();
    invMatrix = new THREE.Matrix4();

    // �@��
    public use: boolean;             // ���̋@�̂��g�p���邩
    public no: number;                  // �@��No.
    public wings: Wing[] = [];       // �e��(0,1-�嗃,2-��������,3-��������,4,5-�G���W��)

    // public position = new CVector3();    // �@�̈ʒu�i���[���h���W�n�j
    // public vpVel = new CVector3();   // �@�̑��x�i���[���h���W�n�j
    // public aVel = new THREE.Euler();    // �@�̌����i�I�C���[�p�j

    public localVelocity = new THREE.Vector3();    // �@�̑��x�i�@�̍��W�n�j
    public gVel = new THREE.Vector3();    // �@�̉����x�i���[���h���W�n�j

    public vaVel = new THREE.Vector3();   // �@�̉�]���x�i�I�C���[�p�j
    public gcVel = new THREE.Vector3();   // �e�ۂ̏����\�z�ʒu
    public height: number;           // �@�̂̍��x
    public gHeight: number;          // �@�̒����̒n�ʂ̍���
    public mass: number;             // �@�̎���
    public iMass = new THREE.Vector3();   // �@�̊e���̊������[�����g
    public onGround: boolean;        // �n�ʏ�ɂ��邩�ǂ���
    public aoa: number;              // �@�̂̌}�p

    // ���c�n

    public stickPos = new THREE.Vector3();   // ���c�n�ʒu�ix,y-�X�e�B�b�N,z-�y�_���j
    public stickVel = new THREE.Vector3();   // ���c�n�ω���

    public readonly stickR = 0.1;    // ���c�n�̊��x (R-�Z���^�[�ւ̌�����)
    public readonly stickA = 0.05;    // ���c�n�̊��x�iA-�ω����j

    public power: number;               // �G���W�����͔䗦�i�~���^���[����9�j
    public throttle: number;            // �X���b�g���ʒu�i�~���^���[����9�j
    public boost: boolean;           // �u�[�X�g
    public gunShoot: boolean;        // �@�e�g���K�[
    public aamShoot: boolean;        // �~�T�C���g���K�[
    public level: number;
    public target: number;       // �������c���̃��x���ƖڕW

    // �@�e�n

    public bullets: Bullet[] = [];         // �e�e�ۃI�u�W�F�N�g
    public gunTarget: number;           // ��ڕW�̋@��No.
    public targetSx: number;
    public targetSy: number;  // ��ڕW�̈ʒu�i�X�N���[�����W�j
    public targetDis: number;        // ��ڕW�܂ł̋���
    public gunTime: number;          // �e�ۏՓ˗\�z���ԁi�@�e�̒ǔ��Ɏg�p�j

    public gunX: number;
    public gunY: number;       // �@�e�̌����i�㉺���E�ғ��͈͂�-1�`1�j

    public gunVx: number;
    public gunVy: number;     // �@�e�����̕ω���

    public gunTemp: number;             // �@�e�̉��x�i0����MAXT�܂Łj
    public heatWait: boolean;        // �������c���̋@�e�I�[�o�[�q�[�g�����҂�

    // �~�T�C���n

    public aam: Missile[] = [];         // �e�~�T�C���I�u�W�F�N�g
    public aamTarget: number[];         // �e�~�T�C���̃��b�N�ڕW

    line: THREE.Line;

    // �R���X�g���N�^
    public constructor(scene: THREE.Scene) {
        super();
        for (let i = 0; i < Plane.BMAX; i++) {
            this.bullets.push(new Bullet(scene));
        }

        for (let i = 0; i < Plane.MMMAX; i++) {
            this.aam.push(new Missile(scene));
        }

        for (let i = 0; i < Plane.WMAX; i++) {
            this.wings.push(new Wing());
        }

        this.aamTarget = new Array<number>(Plane.MMMAX);

        this.posInit();


        var material = new THREE.LineBasicMaterial({ color: 0xffffff });

        var geometry = new THREE.Geometry();

        for (let vertices of Jflight.obj) {
            geometry.vertices.push(vertices[0].clone());
            geometry.vertices.push(vertices[1].clone());
            geometry.vertices.push(vertices[2].clone());
        }

        this.line = new THREE.Line(geometry, material);

        scene.add(this.line);
    }

    // �e�ϐ�������������
    public posInit() {
        this.position.x = (Math.random() - 0.5) * 1000 - 8000;
        this.position.y = (Math.random() - 0.5) * 1000 - 1100;
        this.position.z = 5000;
        this.gHeight = 0;
        this.height = 5000;

        this.rotation.set(0, 0, Math.PI / 2);

        this.velocity.x = 200.0;
        this.velocity.y = 0.0;
        this.velocity.z = 0.0;
        this.gVel.set(0, 0, 0);
        this.vaVel.set(0, 0, 0);
        this.localVelocity.set(0, 0, 0);
        this.power = 5;
        this.throttle = 5;
        this.heatWait = false;
        this.gunTemp = 0;
        this.gcVel.set(this.position.x, this.position.y, this.position.z);
        this.target = -2;
        this.onGround = false;
        this.gunX = 0;
        this.gunY = 100;
        this.gunVx = 0;
        this.gunVy = 0;
        this.boost = false;
        this.aoa = 0;
        this.stickPos.set(0, 0, 0);
        this.stickVel.set(0, 0, 0);


        let wa = 45 * Math.PI / 180;
        let wa2 = 0 * Math.PI / 180;

        // �e���̈ʒu�ƌ������Z�b�g

        //  �E��???
        this.wings[0].position.set(3, 0.1, 0);
        this.wings[0].unitX.set(Math.cos(wa), -Math.sin(wa), Math.sin(wa2));
        this.wings[0].unitY.set(Math.sin(wa), Math.cos(wa), 0);
        this.wings[0].zVel.set(0, 0, 1);

        // �@����???
        this.wings[1].position.set(-3, 0.1, 0);
        this.wings[1].unitX.set(Math.cos(wa), Math.sin(wa), -Math.sin(wa2));
        this.wings[1].unitY.set(-Math.sin(wa), Math.cos(wa), 0);
        this.wings[1].zVel.set(0, 0, 1);

        // ��������
        this.wings[2].position.set(0, -10, 2);
        this.wings[2].unitX.set(1, 0, 0);
        this.wings[2].unitY.set(0, 1, 0);
        this.wings[2].zVel.set(0, 0, 1);

        // ��������
        this.wings[3].position.set(0, -10, 0);
        this.wings[3].unitX.set(0, 0, 1);
        this.wings[3].unitY.set(0, 1, 0);
        this.wings[3].zVel.set(1, 0, 0);

        // �E�G���W��
        this.wings[4].position.set(5, 0, 0);
        this.wings[4].unitX.set(1, 0, 0);
        this.wings[4].unitY.set(0, 1, 0);
        this.wings[4].zVel.set(0, 0, 1);

        // ���G���W��
        this.wings[5].position.set(-5, 0, 0);
        this.wings[5].unitX.set(1, 0, 0);
        this.wings[5].unitY.set(0, 1, 0);
        this.wings[5].zVel.set(0, 0, 1);

        // �e���̎��ʂ��Z�b�g

        this.wings[0].mass = 400 / 2;
        this.wings[1].mass = 400 / 2;
        this.wings[2].mass = 50;
        this.wings[3].mass = 50;
        this.wings[4].mass = 300;
        this.wings[5].mass = 300;

        // �e���̖ʐς��Z�b�g

        this.wings[0].sVal = 60 / 2;
        this.wings[1].sVal = 60 / 2;
        this.wings[2].sVal = 2;
        this.wings[3].sVal = 2;
        this.wings[4].sVal = 0;
        this.wings[5].sVal = 0;

        // �G���W���̐��͂��Z�b�g

        this.wings[0].tVal = 0.1;
        this.wings[1].tVal = 0.1;
        this.wings[2].tVal = 0.1;
        this.wings[3].tVal = 0.1;
        this.wings[4].tVal = 1000;
        this.wings[5].tVal = 1000;

        // �����ʂƊ������[�����g�����߂Ă���

        this.mass = 0;
        this.iMass.set(1000, 1000, 4000);
        let m_i = 1;
        for (let wing of this.wings) {
            this.mass += wing.mass;
            wing.aAngle = 0;
            wing.bAngle = 0;
            // wing.forward.set(0, 0, 1);
            this.iMass.x += wing.mass * (Math.abs(wing.position.x) + 1) * m_i * m_i;
            this.iMass.y += wing.mass * (Math.abs(wing.position.y) + 1) * m_i * m_i;
            this.iMass.z += wing.mass * (Math.abs(wing.position.z) + 1) * m_i * m_i;
        }
    }

    // �@�̂̃��[�J�����W�����[���h���W�ϊ��s������߂�

    public checkTrans() {

        let x = this.rotation.x;
        let y = this.rotation.y;
        let z = this.rotation.z;
        this.sina = Math.sin(x); this.cosa = Math.cos(x);
        if (this.cosa < 1e-9 && this.cosa > 0) {
            this.cosa = 1e-9;
        }
        if (this.cosa > -1e-9 && this.cosa < 0) {
            this.cosa = -1e-9;
        }

        this.sinb = Math.sin(y); this.cosb = Math.cos(y);
        this.sinc = Math.sin(z); this.cosc = Math.cos(z);


        // �s�b�`�i�@��̏㉺�j�����[���i���E�̌X���j�����[(�n�ʐ�������)
        let a = new THREE.Euler(x, -y, z, "YXZ");

        this.matrix.makeRotationFromEuler(a);

        // �t�s����ݒ�
        this.invMatrix.copy(this.matrix);
        // ���s�s��Ȃ̂ŁA�]�u�s�񂪋t�s��ɂȂ�
        this.invMatrix.transpose();
    }

    // ���[���h���W���@�̍��W�֕ϊ�����i�P���ϊ��̂݁j

    public worldToLocal(worldVector: THREE.Vector3, localVector: THREE.Vector3) {
        localVector.copy(worldVector);
        localVector.applyMatrix4(this.matrix);
        //pl.x = pw.x * this.matrix.elements[0] + pw.y * this.matrix.elements[4] + pw.z * this.matrix.elements[8];
        //pl.y = pw.x * this.matrix.elements[1] + pw.y * this.matrix.elements[5] + pw.z * this.matrix.elements[9];
        //pl.z = pw.x * this.matrix.elements[2] + pw.y * this.matrix.elements[6] + pw.z * this.matrix.elements[10];
    }

    // �@�̍��W�����[���h���W�֕ϊ�����i�P���ϊ��̂݁j

    public localToWorld(localVector: THREE.Vector3, worldVector: THREE.Vector3) {
        worldVector.copy(localVector);
        worldVector.applyMatrix4(this.invMatrix);

        // pw.x = pl.x * this.matrix.elements[0] + pl.y * this.matrix.elements[1] + pl.z * this.matrix.elements[2];
        // pw.y = pl.x * this.matrix.elements[4] + pl.y * this.matrix.elements[5] + pl.z * this.matrix.elements[6];
        // pw.z = pl.x * this.matrix.elements[8] + pl.y * this.matrix.elements[9] + pl.z * this.matrix.elements[10];
    }


    // �@�e��~�T�C���̃��b�N����

    public lockCheck(world: Jflight) {
        let a = new THREE.Vector3();
        let b = new THREE.Vector3();
        let nno = new Array<number>(Plane.MMMAX);       // �@��No.
        let dis = new Array<number>(Plane.MMMAX); // �@�̂Ǝ��@�Ƃ̋���

        for (let m = 0; m < Plane.MMMAX; m++) {
            dis[m] = 1e30;
            nno[m] = -1;
        }

        for (let m = 0; m < Jflight.PMAX; m++) {

            // �ڕW�����݂��Ă���΃��b�N���X�g�ɒǉ�
            if (m !== this.no && world.plane[m].use) {

                // �ڕW�Ƃ̋��������߂�
                //a.setMinus(<any>this.position, <any>world.plane[m].position);
                a.subVectors(this.position, world.plane[m].position);
                //let near_dis = a.abs2();
                let near_dis = a.lengthSq();

                if (near_dis < 1e8) {

                    // �ڕW�Ƃ̈ʒu�֌W���@�̍��W�n�ɕϊ�
                    this.worldToLocal(a, b);

                    // ����T�[�N�����Ȃ烍�b�N
                    if (b.y <= 0 && Math.sqrt(b.x * b.x + b.z * b.z) < -b.y * 0.24) {

                        // ���Ƀ��b�N����Ă���̂Ȃ�A���̃��b�N�Ƌ߂����ɒu��������
                        for (let m1 = 0; m1 < Plane.MMMAX; m1++) {
                            if (near_dis < dis[m1]) {
                                for (let m2 = Plane.MMMAX - 1; m2 > m1; m2--) {
                                    dis[m2] = dis[m2 - 1];
                                    nno[m2] = nno[m2 - 1];
                                }
                                dis[m1] = near_dis;
                                nno[m1] = m;
                                break;
                            }
                        }
                    }
                }
            }
        }

        // ���b�N�ڕW��������Ȃ��ꍇ�A��ԋ߂��ڕW�Ƀ��b�N

        for (let m1 = 1; m1 < 4; m1++) {
            if (nno[m1] < 0) {
                nno[m1] = nno[0];
                dis[m1] = dis[0];
            }
        }

        // �S�ȍ~�̃~�T�C���́A����|�b�h�̃~�T�C���ɍ��킹��

        for (let m1 = 4; m1 < Plane.MMMAX; m1++) {
            nno[m1] = nno[m1 % 4];
            dis[m1] = dis[m1 % 4];
        }

        for (let m1 = 0; m1 < Plane.MMMAX; m1++) {
            this.aamTarget[m1] = nno[m1];
        }

        // �@�e�̖ڕW�i��ڕW�j�́A�ł��߂��G�@�ɃZ�b�g
        this.gunTarget = nno[0];
        this.targetDis = Math.sqrt(dis[0]);
    }

    // �@�̂𓮂���
    // ���@�̒e�ۂȂǂ��ړ�

    public move(world: Jflight, autof: boolean) {

        this.checkTrans();           // ���W�ϊ��p�̍s��Čv�Z
        this.lockCheck(world);       // �~�T�C�����b�N����

        if (this.no === 0 && !autof) {  // �蓮���c
            this.keyScan(world);
        } else {
            this.autoFlight(world);   // �������c
        }

        this.moveCalc(world);
        this.moveBullet(world);
        this.moveAam(world);
    }

    // �L�[��Ԃ����ƂɁA�X�e�B�b�N��g���K�[���Z�b�g
    // ���ۂ̃L�[�X�L�������������Ă���̂́AApplet3D�N���X

    protected keyScan(world: Jflight) {
        this.stickVel.set(0, 0, 0);
        this.boost = false;
        let keyboard = Main.keyboard;
        this.gunShoot = keyboard.pressed("space"); // world.keyShoot;
        this.aamShoot = keyboard.pressed("space"); // world.keyShoot;

        if (keyboard.pressed("b")) {
            this.boost = true;
        }

        // �X�e�B�b�N���}���ɓ������Ƃ܂����̂ŁA
        // �X�e�B�b�N���g�Ɋ������������Ċ��炩�ɓ������Ă���B

        if (keyboard.pressed("up")) {
            this.stickVel.x = 1;
        }
        if (keyboard.pressed("down")) {
            this.stickVel.x = -1;
        }
        if (keyboard.pressed("left")) {
            this.stickVel.y = -1;
        }
        if (keyboard.pressed("right")) {
            this.stickVel.y = 1;
        }


        if (this.stickPos.z > 1) {
            this.stickPos.z = 1;
        }
        if (this.stickPos.z < -1) {
            this.stickPos.z = -1;
        }

        // �}�E�X����
        if (world.isMouseMove) {
            let dx = this.stickPos.x - Jflight.mouseY;
            let dy = this.stickPos.y + Jflight.mouseX;
            this.stickVel.x = dx;
            this.stickVel.y = dy;

            // let length = this.stickVel.abs();
            //if (length >= 1) {
            //    this.stickVel.x /= length;
            //    this.stickVel.y /= length;
            //}
            // world.isMouseMove = false;
        }

        // this.stickPos.addCons(this.stickVel, this.stickA);
        this.stickPos.addScaledVector(<any>this.stickVel, this.stickA);
        // this.stickPos.subCons(this.stickPos, this.stickR);
        this.stickPos.addScaledVector(this.stickPos, -this.stickR);

        // �X�e�B�b�N�ʒu�������P�ȓ��Ɋۂ߂Ă���

        let r = Math.sqrt(this.stickPos.x * this.stickPos.x + this.stickPos.y * this.stickPos.y);
        if (r > 1) {
            this.stickPos.x /= r;
            this.stickPos.y /= r;
        }
    }

    // �@�̌v�Z
    public moveCalc(world: Jflight) {
        let ve;
        let dm = new THREE.Vector3();

        // ��ڕW�̌������̈ʒu�����߂Ă����i�@�e�̒ǔ��ŗp����j

        this.targetSx = -1000;
        this.targetSy = 0;
        if (this.gunTarget >= 0 && world.plane[this.gunTarget].use) {

            // ��ڕW�̍��W���X�N���[�����W�ɕϊ�
            // world.change3d(this, world.plane[this.gunTarget].position, dm);
            let camera = Main.camera.clone();
            camera.setRotationFromMatrix(CameraHelper.worldToView(this.matrix));
            camera.position.copy(this.position);
            let p = CameraHelper.toScreenPosition(world.plane[this.gunTarget].position, camera);

            // �X�N���[�����Ȃ�
            if (p.x > 0 && p.x < Main.renderer.context.canvas.width && p.y > 0 && p.y < Main.renderer.context.canvas.height) {
                this.targetSx = p.x;
                this.targetSy = p.y;
            }
        }

        // ���@�̈ʒu����A�n�ʂ̍��������߁A���x�����߂�

        this.gHeight = world.gHeight(this.position.x, this.position.y);
        this.height = this.position.z - this.gHeight;

        // ��C���x�̌v�Z

        if (this.position.z < 5000) {
            ve = 0.12492 - 0.000008 * this.position.z;
        } else {
            ve = (0.12492 - 0.04) - 0.000002 * (this.position.z - 5000);
        }
        if (ve < 0) {
            ve = 0;
        }

        // �e���𑀏c�n�ɍ��킹�ĂЂ˂��Ă���

        this.wings[0].aAngle = -this.stickPos.y * 1.5 / 180 * Math.PI;
        this.wings[0].bAngle = 0;
        this.wings[1].aAngle = this.stickPos.y * 1.5 / 180 * Math.PI;
        this.wings[1].bAngle = 0;
        this.wings[2].aAngle = -this.stickPos.x * 6 / 180 * Math.PI;
        this.wings[2].bAngle = 0;
        this.wings[3].aAngle = this.stickPos.z * 6 / 180 * Math.PI;
        this.wings[3].bAngle = 0;
        this.wings[4].aAngle = 0;
        this.wings[4].bAngle = 0;
        this.wings[5].aAngle = 0;
        this.wings[5].bAngle = 0;

        this.worldToLocal(this.velocity, this.localVelocity);
        this.onGround = false;

        if (this.height < 5) {
            this.onGround = true;
        }

        // af���@�̂ɂ������
        // am���@�̂ɂ����郂�[�����g

        let af = new THREE.Vector3();//new CVector3();
        let am = new THREE.Vector3();//new CVector3();
        // af.set(0, 0, 0);
        // am.set(0, 0, 0);

        // �e���ɓ����͂ƃ��[�����g���v�Z

        this.aoa = 0;
        let i = 0;

        // �v�Z�p�Ɉꎞ�I�Ɏg�p����ϐ�
        let v = new THREE.Vector3();
        for (let wing of this.wings) {
            wing.calc(this, ve, i, this.boost);
            ++i;

            // ��
            // af.x += (wing.fVel.x * this.matrix.elements[0] + wing.fVel.y * this.matrix.elements[1] + wing.fVel.z * this.matrix.elements[2]);
            // af.y += (wing.fVel.x * this.matrix.elements[4] + wing.fVel.y * this.matrix.elements[5] + wing.fVel.z * this.matrix.elements[6]);
            // af.z += (wing.fVel.x * this.matrix.elements[8] + wing.fVel.y * this.matrix.elements[9] + wing.fVel.z * this.matrix.elements[10]) + wing.mass * Jflight.G;

            v.copy(wing.fVel);
            v.applyMatrix4(this.invMatrix);
            v.z += wing.mass * Jflight.G;
            af.add(v);



            // ���[�����g�i�͂Ɨ��ʒu�Ƃ̊O�ρj
            // am.x -= (wing.pVel.y * wing.fVel.z - wing.pVel.z * wing.fVel.y);
            // am.y -= (wing.pVel.z * wing.fVel.x - wing.pVel.x * wing.fVel.z);
            // am.z -= (wing.pVel.x * wing.fVel.y - wing.pVel.y * wing.fVel.x);


            // v = position �~ velocity
            // am -= v;
            v.crossVectors(wing.position, wing.fVel);
            am.sub(v);
        }

        // �p�x�ω���ϕ�

        this.vaVel.x += am.x / this.iMass.x * Jflight.DT;
        this.vaVel.y += am.y / this.iMass.y * Jflight.DT;
        this.vaVel.z += am.z / this.iMass.z * Jflight.DT;


        //let rotX = (this.vaVel.x * this.cosb + this.vaVel.z * this.sinb) * Jflight.DT;
        //let rotY = (this.vaVel.y + (this.vaVel.x * this.sinb - this.vaVel.z * this.cosb) * this.sina / this.cosa) * Jflight.DT;
        //let rotZ = (-this.vaVel.x * this.sinb + this.vaVel.z * this.cosb) / this.cosa * Jflight.DT;


        this.rotation.x += (this.vaVel.x * this.cosb + this.vaVel.z * this.sinb) * Jflight.DT;
        this.rotation.y += (this.vaVel.y + (this.vaVel.x * this.sinb - this.vaVel.z * this.cosb) * this.sina / this.cosa) * Jflight.DT;
        this.rotation.z += (-this.vaVel.x * this.sinb + this.vaVel.z * this.cosb) / this.cosa * Jflight.DT;

        // �@�̂̊p�x�����͈͂Ɋۂ߂Ă���
        for (let q = 0; q < 3 && this.rotation.x >= Math.PI / 2; q++) {
            this.rotation.x = Math.PI - this.rotation.x;
            this.rotation.y += Math.PI;
            this.rotation.z += Math.PI;
        }
        for (let q = 0; q < 3 && this.rotation.x < -Math.PI / 2; q++) {
            this.rotation.x = -Math.PI - this.rotation.x;
            this.rotation.y += Math.PI;
            this.rotation.z += Math.PI;
        }

        for (let q: number = 0; q < 3 && this.rotation.y >= Math.PI; q++) {
            this.rotation.y -= Math.PI * 2;
        }
        for (let q = 0; q < 3 && this.rotation.y < -Math.PI; q++) {
            this.rotation.y += Math.PI * 2;
        }
        for (let q = 0; q < 3 && this.rotation.z >= Math.PI * 2; q++) {
            this.rotation.z -= Math.PI * 2;
        }
        for (let q = 0; q < 3 && this.rotation.z < 0; q++) {
            this.rotation.z += Math.PI * 2;
        }

        // �����x������

        // this.gVel.setConsInv(af, this.mass);
        this.gVel.copy(af);
        this.gVel.multiplyScalar(1 / this.mass);

        // �@�̂Ŕ��������R���[���I�ɐ���

        let _v = new THREE.Vector3();//new CVector3()
        _v.copy(this.velocity);
        _v.normalize();

        this.velocity.x -= this.velocity.x * this.velocity.x * 0.00002 * _v.x;
        this.velocity.y -= this.velocity.y * this.velocity.y * 0.00002 * _v.y;
        this.velocity.z -= this.velocity.z * this.velocity.z * 0.00002 * _v.z;

        // �n�ʂ̌X������

        world.gGrad(this.position.x, this.position.y, dm);
        if (this.onGround) {
            this.gVel.x -= dm.x * 10;
            this.gVel.y -= dm.y * 10;
            let vz = dm.x * this.velocity.x + dm.y * this.velocity.y;
            if (this.velocity.z < vz) {
                this.velocity.z = vz;
            }
        }

        // �u�[�X�g���ɂ́A�@�̂�U��������

        if (this.boost) {
            this.gVel.x += (Math.random() - 0.5) * 5;
            this.gVel.y += (Math.random() - 0.5) * 5;
            this.gVel.z += (Math.random() - 0.5) * 5;
        }

        // �@�̂̈ʒu��ϕ����ċ��߂�

        // this.velocity.addCons(this.gVel, Jflight.DT);
        this.velocity.addScaledVector(this.gVel, Jflight.DT);

        // this.position.addCons(this.velocity, Jflight.DT);
        this.position.addScaledVector(this.velocity, Jflight.DT);

        // �O�̂��߁A�n�ʂɂ߂荞�񂾂��ǂ����`�F�b�N
        if (this.height < 2) {
            this.position.z = this.gHeight + 2;
            this.height = 2;
            this.velocity.z *= -0.1;
        }

        // �n�ʂɂ�����x�ȏ�̑��x���A�����ȑ̐��ŐڐG�����ꍇ�A�@�̂�������
        if (this.height < 5 && (Math.abs(this.velocity.z) > 50 || Math.abs(this.rotation.y) > 20 * Math.PI / 180 || this.rotation.x > 10 * Math.PI / 180)) {
            this.posInit();
        }


        //
        this.line.setRotationFromMatrix(this.matrix);
    }

    // �������c

    public autoFlight(world: Jflight) {
        let m, mm;

        this.gunShoot = false;
        this.aamShoot = false;

        if (this.target < 0 || !world.plane[this.target].use) {
            return;
        }

        this.power = 4;
        this.throttle = this.power;
        this.stickPos.z = 0;

        if (this.level < 0) {
            this.level = 0;
        }

        let dm_p = new THREE.Vector3();
        let dm_a = new THREE.Vector3();

        // �ڕW�Ǝ��@�̈ʒu�֌W�����߁A�@�̍��W�ɕϊ����Ă���
        //dm_p.setMinus(<any>this.position, <any>world.plane[this.target].position);
        dm_p.subVectors(this.position, world.plane[this.target].position);
        this.worldToLocal(dm_p, dm_a);

        // mm�́A�X�e�B�b�N�̈ړ����E��

        if (this.level >= 20) {
            mm = 1;
        } else {
            mm = (this.level + 1) * 0.05;
        }

        this.stickVel.x = 0;
        this.stickVel.y = 0;
        m = Math.sqrt(dm_a.x * dm_a.x + dm_a.z * dm_a.z);

        // �X���b�g���̈ʒu�́A�ڕW�ɂ��킹��

        if (this.level > 8 && this.gunTime < 1) {
            this.power = world.plane[this.target].power;
        } else {
            this.power = 9;
        }

        // �ڕW������Ɍ�����ꍇ�A�X�e�B�b�N������
        if (dm_a.z < 0) {
            this.stickVel.x = dm_a.z / m * mm;
        }

        // �ڕW�̍��E�������ʒu�ɍ��킹�āA�X�e�B�b�N�����E�ɓ�����
        this.stickVel.y = -dm_a.x / m * mm * 0.4;

        if (this.stickVel.y > 1) {
            this.stickVel.y = 1;
        }
        if (this.stickVel.y < -1) {
            this.stickVel.y = -1;
        }

        // �X�e�B�b�N�̊�������
        this.stickPos.x += this.stickVel.x;
        this.stickPos.y += this.stickVel.y;

        if (this.stickPos.x > 1) {
            this.stickPos.x = 1;
        }
        if (this.stickPos.x < -1) {
            this.stickPos.x = -1;
        }
        if (this.stickPos.y > 1) {
            this.stickPos.y = 1;
        }
        if (this.stickPos.y < -1) {
            this.stickPos.y = -1;
        }

        // �@�̍��x���Ⴂ���A8�b�ȓ��ɒn�ʂɂԂ��肻���ȏꍇ�A��Ɍ�����
        if (this.height < 1000 || this.height + this.velocity.z * 8 < 0) {
            this.stickPos.y = -this.rotation.y;
            if (Math.abs(this.rotation.y) < Math.PI / 2) {
                this.stickPos.x = -1;
            } else {
                this.stickPos.x = 0;
            }
        }

        // �X�e�B�b�N�ʒu���P�ȓ��Ɋۂ߂Ă���

        m = Math.sqrt(this.stickPos.x * this.stickPos.x + this.stickPos.y * this.stickPos.y);
        if (m > mm) {
            this.stickPos.x *= mm / m;
            this.stickPos.y *= mm / m;
        }

        // ��ڕW�Ƃ��đI�΂�Ă���̂Ȃ�A�@�e������
        if (this.gunTarget === this.target && this.gunTime < 1) {
            // �@�e���I�[�o�[�q�[�g���Ă���ꍇ�A���x��������܂ő҂�
            if (!this.heatWait && this.gunTemp < Plane.MAXT - 1) {
                this.gunShoot = true;
            } else {
                this.heatWait = true;
            }
        }

        if (this.gunTemp < 2) {
            this.heatWait = false;
        }
        // ��ڕW�Ƃ��đI�΂�Ă���̂Ȃ�A�~�T�C��������

        if (this.gunTarget === this.target) {
            this.aamShoot = true;
        }

        // �����������ȏꍇ�A�X�e�B�b�N�𗣂�

        if (Math.abs(this.aoa) > 0.35) {
            this.stickPos.x = 0;
        }
    }

    // �@�e�̒e�ۈړ��Ɣ��ˏ���

    public moveBullet(world: Jflight) {
        // let aa;

        // let sc = new THREE.Vector3();
        // let a = new THREE.Vector3();
        // let b = new THREE.Vector3();
        let c = new THREE.Vector3();
        let dm = new THREE.Vector3();
        let oi = new THREE.Vector3();
        let ni = new THREE.Vector3();

        // �e�ۂ̏������x�����߂Ă���
        dm.set(this.gunX * 400 / 200, 400, this.gunY * 400 / 200);
        this.localToWorld(dm, oi);
        oi.add(<any>this.velocity);
        this.gunTime = 1.0;

        // �e�ۂ̏����ʒu�����߂Ă���
        dm.set(4 * 2, 10.0, 4 * -0.5);
        this.localToWorld(dm, ni);

        // �e�ۂ̓��B�\�z���Ԃ����߂Ă���
        if (this.gunTarget >= 0)
            this.gunTime = this.targetDis / (oi.length() * 1.1);
        if (this.gunTime > 1.0)
            this.gunTime = 1.0;

        // �e�ۂ̓����\�z�ʒu�����߂�
        this.gcVel.x = this.position.x + ni.x + (oi.x - this.gVel.x * this.gunTime) * this.gunTime;
        this.gcVel.y = this.position.y + ni.y + (oi.y - this.gVel.y * this.gunTime) * this.gunTime;
        this.gcVel.z = this.position.z + ni.z + (oi.z + (-9.8 - this.gVel.z) * this.gunTime / 2) * this.gunTime;

        // world.change3d(this, this.gcVel, sc);
        let camera = Main.camera.clone();
        camera.setRotationFromMatrix(CameraHelper.worldToView(this.matrix));
        camera.position.copy(this.position);
        camera.updateProjectionMatrix();

        let sc = CameraHelper.toScreenPosition(this.gcVel, camera);

        // �@�e��ڕW�֌�����
        if (this.gunTarget >= 0) {
            //c.set(world.plane[this.gunTarget].position.x, world.plane[this.gunTarget].position.y, world.plane[this.gunTarget].position.z);
            c.copy(world.plane[this.gunTarget].position);
            //c.addCons(<any>world.plane[this.gunTarget].velocity, this.gunTime);
            c.addScaledVector(world.plane[this.gunTarget].velocity, this.gunTime);

            // world.change3d(this, c, a);
            let a = CameraHelper.toScreenPosition(c, camera);

            // world.change3d(this, world.plane[this.gunTarget].position, b);
            let b = CameraHelper.toScreenPosition(world.plane[this.gunTarget].position, camera);
            sc.x += b.x - a.x;
            sc.y += b.y - a.y;
        }

        if (this.targetSx > -1000) {
            let xx = (this.targetSx - sc.x);
            let yy = (this.targetSy - sc.y);
            let mm = Math.sqrt(xx * xx + yy * yy);
            if (mm > 20) {
                xx = xx / mm * 20;
                yy = yy / mm * 20;
            }
            this.gunVx += xx;
            this.gunVy -= yy;
        }
        this.gunX += this.gunVx * 100 / 300;
        this.gunY += this.gunVy * 100 / 300;
        this.gunVx -= this.gunVx * 0.3;
        this.gunVy -= this.gunVy * 0.3;

        // �@�e�ғ����E�����`�F�b�N

        let y = this.gunY - 20;
        let r = Math.sqrt(this.gunX * this.gunX + this.gunY * this.gunY);
        if (r > 100) {
            let x = this.gunX;
            x *= 100 / r;
            y *= 100 / r;
            this.gunX = x;
            this.gunY = y + 20;
            this.gunVx = 0;
            this.gunVy = 0;
        }

        // �e�ۈړ�
        for (let bullet of this.bullets) {
            if (bullet.use !== 0) {
                bullet.move(world, this);
            }
        }

        // �e�۔��ˏ���
        if (this.gunShoot && this.gunTemp++ < Plane.MAXT) {
            for (let i = 0; i < Plane.BMAX; i++) {
                if (this.bullets[i].use === 0) {
                    // this.bullets[i].velocity.setPlus(this.velocity, oi);
                    this.bullets[i].velocity.addVectors(this.velocity, <any>oi);
                    let aa = Math.random();

                    // this.bullets[i].position.setPlus(this.position, ni);
                    this.bullets[i].position.addVectors(this.position, <any>ni);

                    // this.bullets[i].position.addCons(this.bullets[i].velocity, 0.1 * aa);
                    this.bullets[i].position.addScaledVector(this.bullets[i].velocity, 0.1 * aa);

                    this.bullets[i].oldPosition.set(this.bullets[i].position.x, this.bullets[i].position.y, this.bullets[i].position.z);
                    this.bullets[i].bom = 0;
                    this.bullets[i].use = 15;
                    break;
                }
            }
        } else if (this.gunTemp > 0) {
            this.gunTemp--;
        }
    }

    // �~�T�C���ړ��Ɣ��ˏ���

    public moveAam(world: Jflight) {
        let dm = new THREE.Vector3();
        let ni = new THREE.Vector3();
        let oi = new THREE.Vector3();

        for (let k = 0; k < Plane.MMMAX; k++) {

            // �e�~�T�C���ړ�
            if (this.aam[k].use > 0) {
                this.aam[k].move(world, this);
            }

            // �^�C���A�E�g���������
            if (this.aam[k].use === 0)
                this.aam[k].use = -1;
        }

        // �~�T�C�����ˏ���
        // �������A�ڕW���߂�����ƌ��ĂȂ�

        if (this.aamShoot && this.targetDis > 50) {

            // �g���Ă��Ȃ��~�T�C����T��

            let k;
            for (k = 0; k < Plane.MMMAX; k++) {
                if (this.aam[k].use < 0 && this.aamTarget[k] >= 0) {
                    break;
                }
            }

            if (k !== Plane.MMMAX) {
                let ap = this.aam[k];

                //  ���ˈʒu�����߂�

                switch (k % 4) {
                    case 0: dm.x = 6; dm.z = 1; break;
                    case 1: dm.x = -6; dm.z = 1; break;
                    case 2: dm.x = 6; dm.z = -1; break;
                    case 3: dm.x = -6; dm.z = -1; break;
                }
                dm.y = 2;
                this.localToWorld(dm, ni);

                //  ���ˑ��x�����߂�

                let v2 = 0;
                let v3 = 5;
                let vx = Math.random() * v3;
                let vy = Math.random() * v3;
                v2 *= (k / 4) + 1;
                vx *= (k / 4) + 1;
                vy *= (k / 4) + 1;
                switch (k % 4) {
                    case 0: dm.x = vx; dm.z = vy - v2; break;
                    case 1: dm.x = -vx; dm.z = vy - v2; break;
                    case 2: dm.x = vx; dm.z = -vy - v2; break;
                    case 3: dm.x = -vx; dm.z = -vy - v2; break;
                }
                dm.y = 40;
                this.localToWorld(dm, oi);

                // ap.position.setPlus(this.position, ni);
                ap.position.addVectors(this.position, <any>ni);

                // ap.velocity.setPlus(this.velocity, oi);
                ap.velocity.addVectors(this.velocity, <any>oi);

                // ���ˌ��������߂�

                switch (k % 4) {
                    case 0: dm.x = 8; dm.z = 1 + 10; break;
                    case 1: dm.x = -8; dm.z = 1 + 10; break;
                    case 2: dm.x = 5; dm.z = -1 + 10; break;
                    case 3: dm.x = -5; dm.z = -1 + 10; break;
                }
                dm.y = 50.0;
                dm.z += (k / 4) * 5;
                this.localToWorld(dm, oi);
                //let v = oi.abs();
                let v = oi.length();
                // ap.forward.setConsInv(oi, v);
                ap.forward.copy(<any>oi);
                ap.forward.divideScalar(v);

                // �e�평����

                ap.use = 100;
                ap.count = 0;
                ap.bom = 0;
                ap.targetNo = this.aamTarget[k];
            }
        }
    }

}
