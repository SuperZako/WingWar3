//
// bullet
// �e�ۃN���X
//

class Bullet extends PhysicsState {

    // �ϐ�
    public oldPosition = new THREE.Vector3();     // �P�X�e�b�v�O�̈ʒu

    public use = 0;               // �g�p��ԁi0�Ŗ��g�p�j
    public bom = 0;               // ������ԁi0�Ŗ����j

    private sphere: THREE.Mesh;
    // �R���X�g���N�^

    public constructor(scene: THREE.Scene) {
        super();
        var geometry: THREE.SphereGeometry = new THREE.SphereGeometry(5, 8, 8);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.visible = false;
        scene.add(this.sphere);
    }

    // �e�ۈړ��A�G�@�Ƃ̂����蔻��A�n�ʂƂ̓����蔻����s��
    // �e�۔��ˏ�����Jflight�N���X���ōs���Ă���

    public move(world: Game, plane: Plane) {

        // �d�͉���
        this.velocity.z += Game.G * Game.DT;

        // ��O�̈ʒu��ۑ�
        // this.oldPosition.set(this.position.x, this.position.y, this.position.z);
        this.oldPosition.copy(this.position);

        // �ړ�
        // this.position.addCons(this.velocity, Jflight.DT);
        this.position.addScaledVector(this.velocity, Game.DT);
        this.use--;

        // �e�ۂ��ړ�������
        if (this.use > 0) {
            //this.sphere.position.x = this.position.x;
            //this.sphere.position.y = this.position.y;
            //this.sphere.position.z = this.position.z;
            this.sphere.position.copy(this.position);
            this.sphere.visible = true;
        } else {
            this.sphere.visible = false;
        }

        // �e�ۂ��������̏ꍇ�A���~�\��
        if (this.bom > 0) {
            // this.change3d(this.plane[0], bp.opVel, cp);
            // this.fillBarc(cp);
            this.bom--;
        }
        // �ڕW����܂��Ă���̂Ȃ�^�[�Q�b�g�Ƃ̓����蔻����s��
        // �ڕW�ȊO�Ƃ̓����蔻��͍s��Ȃ�

        if (plane.gunTarget > -1) {

            // �ڕW�����݂��Ă���ꍇ

            // �����ł̓����蔻����@�́A
            // ��O�̈ʒu�ƌ��݂̈ʒu�Ƃ̋�����
            // ��O�̈ʒu�ƖڕW�̋����A���݂̈ʒu�ƖڕW�̋����Ƃ̘a���r���邱�Ƃ�
            // �s���Ă���B�e�ۑ��x���������߁A�P�ɋ��������߂Ă�������Ȃ��B
            // �_�ƒ����̕������ōĐڋߋ��������߂Ă��ǂ����A�ʓ|�������̂Ŏ蔲�� �B

            // ���݂̒e�ۂ̈ʒu�ƖڕW�Ƃ̍��x�N�g�������߂�
            let a = new THREE.Vector3();
            // this.m_a.setMinus(<any>this.position, <any>world.plane[plane.gunTarget].position);
            a.subVectors(this.position, world.plane[plane.gunTarget].position);

            // ��O�̒e�ۂ̈ʒu�ƖڕW�Ƃ̍��x�N�g�������߂�
            let b = new THREE.Vector3();
            // this.m_b.setMinus(<any>this.oldPosition, <any>world.plane[plane.gunTarget].position);
            b.subVectors(this.oldPosition, world.plane[plane.gunTarget].position);

            // ��O�̒e�ۂ̈ʒu�ƌ��݂̒e�ۂ̈ʒu�Ƃ̍��x�N�g�������߂�
            //this.m_vv.setCons(<any>this.velocity, Jflight.DT);
            let v = new THREE.Vector3();
            v.copy(this.velocity);
            v.multiplyScalar(Game.DT);

            //let v0 = this.m_vv.abs();
            let v0 = v.length();
            // let l = this.m_a.abs() + this.m_b.abs();
            let l = a.length() + b.length();

            if (l < v0 * 1.05) {
                // ����
                this.bom = 1;  // �����\���p�ɃZ�b�g
                this.use = 10; // �����ɂ͏����Ȃ��Œ��˔�΂�

                // ���݈ʒu�ƈ�O�̈ʒu�̒��Ԉʒu�����̑��x�����𑫂��Ē��˔�΂�
                // v.x = (a.x + b.x) / 2.0;
                // v.y = (a.y + b.y) / 2.0;
                // v.z = (a.z + b.z) / 2.0;
                v.addVectors(a, b);
                v.divideScalar(2);

                // l = this.m_vv.abs();
                // this.m_vv.consInv(l);
                v.normalize();

                // this.velocity.addCons(this.m_vv, v0 / 0.1);
                this.velocity.addScaledVector(v, v0 / 0.1);

                // this.velocity.cons(0.1);
                this.velocity.multiplyScalar(0.1);
            }
        }

        // �n�ʂƂ̓����蔻��

        let gh = world.gHeight(this.position.x, this.position.y);
        if (this.position.z < gh) {
            // �n�ʈȉ��Ȃ�A�����˂�����
            this.velocity.z = Math.abs(this.velocity.z);
            this.position.z = gh;
            this.velocity.x += (Math.random() - 0.5) * 50;
            this.velocity.y += (Math.random() - 0.5) * 50;
            this.velocity.x *= 0.5;
            this.velocity.y *= 0.5;
            this.velocity.z *= 0.1;
        }
    }
}
