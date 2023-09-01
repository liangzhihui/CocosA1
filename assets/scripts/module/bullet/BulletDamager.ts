import { math, _decorator } from "cc";
import { Bullet } from "./Bullet";
import { IBulletObserver } from "./BulletObserver";
import { ObjectPool } from "../../utils/ObjectPool";
import { EntitySide } from "../../const/EntityConst";
const { ccclass } = _decorator;

@ccclass("BulletDamager")
export class BulletDamager implements IBulletObserver {

    public side: EntitySide = null;

    update(bullet: Bullet, pos?: math.Vec2): void {
        pos = pos || bullet.getPos();

        let side = this.side;
        if (side == EntitySide.Enemy) {
            let role = A1.actorManager.model.role;
            let rect = role.transform.getBoundingBox();
            if (rect.contains(pos)) {
                if (!role.limitDecHp) {
                    role.setLimitDecHp();
                    role.attr.decHp();
                }

                bullet.energy = 0;
            }
        }
    }

    reset() {
    }

    dispose() {
    }

    static alloc(side: EntitySide) {
        let res = ObjectPool.pop(BulletDamager);
        res.side = side;
        return res;
    }

    static restore(bulletDamager: BulletDamager) {
        bulletDamager.dispose();
        ObjectPool.push(bulletDamager);
    }
}