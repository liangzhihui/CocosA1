import { Vec2 } from "cc";
import { Trajectory } from "../../const/BulletConst";
import { BulletSystem } from "./BulletSystem";
import { toFixed } from "../../utils/mathUtil";
import { BulletManager } from "./BulletManager";
import { Bullet } from "./Bullet";
import { BulletDamager } from "./BulletDamager";

const v2_1 = new Vec2();
const v2_2 = new Vec2();
const v2_3 = new Vec2();

export class ProjectileBulletSystem extends BulletSystem {
    bulletSize = 1;

    trajectory: Trajectory;
    trajectorySpeed: number;
    trajectoryAccel: number;

    setTrajectory(trajectory: Trajectory) {
        this.trajectory = trajectory;
    }

    setTrajectorySpeed(trajectorySpeed: number) {
        this.trajectorySpeed = trajectorySpeed;
    }

    setTrajectoryAccel(trajectoryAccel: number) {
        this.trajectoryAccel = trajectoryAccel;
    }

    constructor() {
        super();
        this.trajectory = Trajectory.tLinear;
        this.trajectorySpeed = 1;
        this.trajectoryAccel = 0;
    }

    createProjectileBullet(startPos: Vec2, targetPos: Vec2) {
        let bullet = super.allocBullet();
        this.initBullet(bullet, startPos);
        Vec2.copy(bullet.targetPos, targetPos);
        Vec2.subtract(v2_1, targetPos, startPos);
        v2_1.normalize();
        v2_1.x = toFixed(v2_1.x, 3);
        v2_1.y = toFixed(v2_1.y, 3);
        Vec2.multiplyScalar(bullet.speed, v2_1, this.trajectorySpeed);
        Vec2.multiplyScalar(bullet.accel, v2_1, this.trajectoryAccel);
        A1.bulletManager.node.emit(BulletManager.EventType.addBullet, bullet);
        return bullet;
    }

    protected updateBullet(b: Bullet) {
        super.updateBullet(b);

        Vec2.floor(v2_1, b.lastPos);
        Vec2.floor(v2_2, b.pos);

        if (!Vec2.equals(v2_1, v2_2)) {

            const damager = b.observer as BulletDamager;
            if (!!damager) {
                damager.update(b, v2_1);
            }
        }
    }

    protected deathTest(b: Bullet, pos?: Vec2) {
        return b.energy <= 0
            || !A1.level.checkPos(pos ?? b.pos);
    }

    protected killBullet(b: Bullet) {
        super.killBullet(b);
        A1.bulletManager.node.emit(BulletManager.EventType.removeBullet, b);
    }

    protected disposeBullet(b: Bullet) {
        let observer = b.getObserver() as BulletDamager;
        if (observer != void 0)
            BulletDamager.restore(observer);
        b.setObserver(null);
    }

    static strToTrajectory(str: string) {
        switch (str) {
            case "linear": return Trajectory.tLinear;
        }
    }

}