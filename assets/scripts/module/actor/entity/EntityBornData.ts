import { Vec2 } from "cc";
import { _decorator } from "cc";
import { ObjectPool } from "../../../utils/ObjectPool";
import { EntityForward, EntitySide } from "../../../const/EntityConst";

const { ccclass, property } = _decorator;

@ccclass("EntityBornData")
export class EntityBornData {
    @property
    pos: Vec2 = new Vec2();

    @property
    forward: EntityForward = EntityForward.Left;

    @property
    hp: number = 1;

    @property
    actorResUrl: string = "";

    @property
    weaponResUrl: string = "";

    @property
    side: EntitySide = EntitySide.Our;

    static create() {
        return ObjectPool.pop(EntityBornData)
    }

    public dispose(): void {
        ObjectPool.push(this);
    }
}