//
// missile
// �~�T�C���N���X
//
class Missile extends PhysicsState {

    // �萔
    public static MOMAX = 50;           // ���̒����̍ő�l

    // �ϐ�
    public oldPositions: THREE.Vector3[] = [];      // �̂̈ʒu�i���̈ʒu�j

    public forward = new THREE.Vector3();       // �����i�P�ʃx�N�g���j

    public use = 0;                     // �g�p��ԁi0�Ŗ��g�p�j
    public bom = 0;                     // ������ԁi0�Ŗ����j
    public bomm = 0;                    // �j���ԁi0�Ŗ����j
    public count: number;               // �����O�o�b�t�@���i���̒����j
    public targetNo: number;            // �^�[�Q�b�gNO�i0>�Ń��b�NOFF�j

    private spheres: THREE.Mesh[] = [];
    private explosion: THREE.Mesh;

    public constructor(scene: THREE.Scene) {
        super();
        for (let i = 0; i < Missile.MOMAX; i++) {
            this.oldPositions.push(new THREE.Vector3());
        }

        // this.m_a0 = new CVector3();

        let geometries: THREE.SphereGeometry[] = [];
        for (let i: number = 0; i < Missile.MOMAX; ++i) {
            geometries.push(new THREE.SphereGeometry(5, 8, 8));
        }

        let materials: THREE.MeshBasicMaterial[] = [];
        for (let i = 0; i < Missile.MOMAX; ++i) {
            materials.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
            materials[i].opacity = 0.5;
            materials[i].transparent = true;
        }

        for (let i = 0; i < Missile.MOMAX; ++i) {
            this.spheres.push(new THREE.Mesh(geometries[i], materials[i]));
        }

        for (let i = 0; i < Missile.MOMAX; ++i) {
            this.spheres[i].visible = false;
            scene.add(this.spheres[i]);
        }

        this.explosion = new THREE.Mesh(new THREE.SphereGeometry(50, 16, 16), new THREE.MeshBasicMaterial({ color: 0xf0f0f0 }));
        this.explosion.visible = false;
        scene.add(this.explosion);
    }

    // �~�T�C���̃z�[�~���O����

    public horming(world: Game, _plane: Plane) {

        // ���b�NON����Ă��āA�c��X�e�b�v��85�ȉ��Ȃ�z�[�~���O����

        if (this.targetNo >= 0 && this.use < 100 - 15) {

            // �����̑��x�����߂�
            let v = this.velocity.length();
            if (Math.abs(v) < 1) {
                v = 1;
            }

            // �ǔ��ڕW
            let tp = world.plane[this.targetNo];

            // �ǔ��ڕW�Ƃ̋��������߂�
            // this.m_a0.setMinus(<any>tp.position, <any>this.position);
            let a0 = new THREE.Vector3();
            a0.subVectors(tp.position, this.position);

            // let l = this.m_a0.abs();
            let l = a0.length();
            if (l < 0.001) {
                l = 0.001;
            }

            // �ǔ��ڕW�Ƃ̑��x�������߂�
            // this.m_a0.setMinus(<any>tp.velocity, <any>this.velocity);
            a0.subVectors(tp.velocity, this.velocity);
            // let m = this.m_a0.abs();
            let m = a0.length();

            // �Փ˗\�z���Ԃ��C������ŋ��߂�
            let t0 = l / v * (1.0 - m / (800 + 1));

            // �Փ˗\�z���Ԃ��O����T�Ɋۂ߂�
            if (t0 < 0) {
                t0 = 0;
            }
            if (t0 > 5) {
                t0 = 5;
            }

            // �Փ˗\�z���Ԏ��̃^�[�Q�b�g�̈ʒu�Ǝ����̈ʒu�̍������߂�
            a0.x = tp.position.x + tp.velocity.x * t0 - (this.position.x + this.velocity.x * t0);
            a0.y = tp.position.y + tp.velocity.y * t0 - (this.position.y + this.velocity.y * t0);
            a0.z = tp.position.z + tp.velocity.z * t0 - (this.position.z + this.velocity.z * t0);

            let tr = ((100 - 15) - this.use) * 0.02 + 0.5;
            if (tr > 0.1) {
                tr = 0.1;
            }

            if (tr < 1) {
                // ���˒���́A�h��ȋ@�������Ȃ�
                // l = this.m_a0.abs();
                l = a0.length();
                // this.forward.addCons(this.m_a0, l * tr * 10);
                this.forward.addScaledVector(a0, l * tr * 10);
            } else {
                // �����łȂ��ꍇ�A�ǔ������փ~�T�C���@���������
                //this.forward.set(this.m_a0.x, this.m_a0.y, this.m_a0.z);
                this.forward.copy(a0);
            }

            // ������P�ʃx�N�g���ɕ␳
            //this.forward.consInv(this.forward.abs());
            this.forward.normalize();
        }

    }

    // �~�T�C�����[�^�[�v�Z

    public calcMotor(_world: Game, _plane: Plane) {

        // ���˒���̓��[�^�[OFF
        if (this.use < 100 - 5) {
            let aa = 1.0 / 20;
            let bb = 1 - aa;

            // ���݂̑��x�����ƌ����������������ĐV���ȑ��x�����Ƃ���
            let v = this.velocity.length();
            this.velocity.x = this.forward.x * v * aa + this.velocity.x * bb;
            this.velocity.y = this.forward.y * v * aa + this.velocity.y * bb;
            this.velocity.z = this.forward.z * v * aa + this.velocity.z * bb;

            // �~�T�C������
            // this.velocity.addCons(this.forward, 10.0);
            this.velocity.addScaledVector(this.forward, 10.0);
        }
    }

    // �~�T�C���ړ��A�G�@�Ƃ̂����蔻��A�n�ʂƂ̓����蔻����s��
    // �~�T�C�����ˏ�����Jflight�N���X���ōs���Ă���

    public move(world: Game, plane: Plane) {

        // �������Ȃ�J�E���^����
        if (this.bom > 0) {

            // ��������
            this.count = 0;

            this.bom--;
            if (this.bom < 0) {
                this.use = 0;
            }

            return;
        }

        // �d�͉���
        this.velocity.z += Game.G * Game.DT;

        // �z�[�~���O�v�Z
        this.horming(world, plane);

        // �~�T�C�����[�^�[�v�Z
        this.calcMotor(world, plane);

        // �����O�o�b�t�@�Ɉʒu��ۑ�
        // this.oldPositions[this.use % Missile.MOMAX].set(this.position.x, this.position.y, this.position.z);
        this.oldPositions[this.use % Missile.MOMAX].copy(this.position);

        // �~�T�C���ړ�
        // this.position.addCons(this.velocity, Jflight.DT);
        this.position.addScaledVector(this.velocity, Game.DT);
        this.use--;

        // �^�[�Q�b�g�Ƃ̓����蔻��
        // ���b�N���Ă���ΏۂƂ̂ݓ����蔻�肷��

        if (this.targetNo >= 0) {

            // �ǔ��ڕW
            let tp = world.plane[this.targetNo];

            // �^�[�Q�b�g�Ƃ̋��������߂āA������x�ȉ��Ȃ瓖����i�ڐG�M�ǂ̂ݎg�p�j
            //this.m_a0.setMinus(<any>this.position, <any>tp.position);
            let a0 = new THREE.Vector3();
            a0.subVectors(this.position, tp.position);
            //if (this.m_a0.abs() < 10) {
            if (a0.length() < 10) {
                this.bom = 10;

                // ����
                // tp.posInit();
            }
        }

        if (this.use >= 0) {

            // �~�T�C�����������łȂ���΁A�~�T�C���{�̂�\��
            if (this.bom <= 0) {
                // dm.x = ap.pVel.x + ap.aVel.x * 4;
                // dm.y = ap.pVel.y + ap.aVel.y * 4;
                // dm.z = ap.pVel.z + ap.aVel.z * 4;
                // this.change3d(this.plane[0], dm, cp);
                // this.change3d(this.plane[0], ap.pVel, dm);
                // this.drawAline(cp, dm);
            }

            // �~�T�C���̉���\��
            // ���̍��W�̓����O�o�b�t�@�Ɋi�[����Ă���

            for (let i = 0; i < Missile.MOMAX; ++i) {
                this.spheres[i].visible = false;
            }
            let k = (this.use + Missile.MOMAX + 1) % Missile.MOMAX;
            // this.change3d(this.plane[0], ap.opVel[k], dm);
            for (let m = 0; m < this.count; m++) {
                // this.change3d(this.plane[0], ap.opVel[k], cp);
                // this.drawMline(context, dm, cp);
                this.spheres[k].position.x = this.oldPositions[k].x;
                this.spheres[k].position.y = this.oldPositions[k].y;
                this.spheres[k].position.z = this.oldPositions[k].z;
                this.spheres[k].visible = true;
                k = (k + Missile.MOMAX + 1) % Missile.MOMAX;
                // dm.set(cp.x, cp.y, cp.z);
            }
        }

        // �~�T�C�����������̏ꍇ�A���~�\��
        this.explosion.visible = false;
        if (this.bom > 0) {
            // this.explosion.position.x = this.position.x;
            // this.explosion.position.y = this.position.y;
            // this.explosion.position.z = this.position.z;

            this.explosion.position.copy(this.position);
            this.explosion.visible = true;

            // this.change3d(this.plane[0], ap.pVel, cp);
            // this.fillBarc(cp);
        }

        // �n�ʂƂ̓����蔻��

        let gh = world.gHeight(this.position.x, this.position.y);
        if (this.position.z < gh) {
            this.bom = 10;
            this.position.z = gh + 3;
        }

        // �����O�o�b�t�@���i���̒����j��ݒ�
        if (this.count < Missile.MOMAX) {
            this.count++;
        }
    }

}
