import { _decorator } from "cc";
import { Trajectory } from "../../const/BulletConst";

const { ccclass, property } = _decorator;

@ccclass("BulletData")
export class BulletData {
    /** 子弹的能量 */
    @property
    energy: number = 0;

    /** 子弹的大小 */
    @property
    size: number = 0;

    /** 子弹的资源 */
    @property
    resUrl: string = "";

    /** 子弹的弹道 */
    @property({ type: Trajectory })
    trajectory: Trajectory = Trajectory.tLinear;

    /** 子弹的速度 */
    @property
    speed: number = 0;

    /** 子弹的加速度 */
    @property
    accel: number = 0;
}