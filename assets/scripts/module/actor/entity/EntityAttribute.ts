import { _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass("EntityAttribute")
export class EntityAttribute {
    /** 角色血量 */
    @property
    hp: number = 100;
    /** 角色移动速度 */
    @property
    maxMoveSpeed: number = 0;
    /** 武器旋转速度（度/每秒） */
    @property
    weaponAngleSpeed: number = 0;
    /** 武器击退效果 */
    @property
    weaponBeatback: number = 0;
}