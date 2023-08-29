import { Vec2 } from "cc";
import { _decorator } from "cc";
import { ObjectPool } from "../../../utils/ObjectPool";
import { EntityForward, EntitySide } from "../../../const/EntityConst";
import { DEV } from "cc/env";

const { ccclass, property } = _decorator;

@ccclass("EntityBornData")
export class EntityBornData {
    @property({ tooltip: DEV && "角色初始坐标"})
    pos: Vec2 = new Vec2();

    @property({ tooltip: DEV && "角色初始朝向", type: EntityForward })
    forward: EntityForward = EntityForward.Left;

    @property({ tooltip: DEV && "角色血量"})
    hp: number = 1;

    @property({ tooltip: DEV && "角色资源" })
    actorResUrl: string = "";

    @property({ tooltip: DEV && "武器资源"})
    weaponResUrl: string = "";

    @property({ tooltip: DEV && "角色阵营", type: EntitySide })
    side: EntitySide = EntitySide.Our;

    static create(side?: EntitySide) {
        let res = ObjectPool.pop(EntityBornData)
        if (side != undefined) {
            res.side = side;
        }
        return res;
    }

    public dispose(): void {
        ObjectPool.push(this);
    }
}