import { _decorator, EventTarget } from "cc";

const { ccclass, property } = _decorator;

const EventType = {
    hpChanged : "hpChanged",
    died : "died",
}

@ccclass("EntityAttribute")
export class EntityAttribute extends EventTarget {
    public static EventType = EventType;

    /** 角色血量 */
    @property
    hp: number = 5;
    /** 角色移动速度 */
    @property
    maxMoveSpeed: number = 0;
    /** 武器旋转速度（度/每秒） */
    @property
    weaponAngleSpeed: number = 0;
    /** 武器最大旋转速度（度/每秒） */
    @property
    weaponMaxAngleSpeed: number = 0;
    /** 武器击退效果 */
    @property
    weaponBeatback: number = 0;

    private setHp(value: number) {
        this.hp = value | 0;
        this.emit(EventType.hpChanged);
    }

    decHp() {
        if (this.hp > 0) {
            this.setHp(this.hp - 1);
            if (this.hp <= 0) {
                this.hp = 0;
                this.emit(EventType.died);
            }
        }
    }
}