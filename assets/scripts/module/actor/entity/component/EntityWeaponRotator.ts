import { Component, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("EntityWeaponRotator")
export class EntityWeaponRotator extends Component {

    /** 旋转速度（度/每秒） */
    @property
    public speed: number = 0;
    /** 最大速度 */
    @property
    public maxSpeed: number = 700;

    /** 超过期望旋转速度后的阻力 */
    public maxForce: number = 3;

    /** 期望旋转速度 */
    public expectSpeed: number = 0;

    /** 旋转方向 1 逆时针 2 顺时针 */
    public direction: number = 1;

    /** 当前的旋转角度 */
    private angle: number = 0;

    protected onLoad() {
        this.expectSpeed = this.speed
    }

    protected update(dt: number): void {
        this.updateRotation(dt);
    }

    public setSpeed(value: number) {
        this.speed = value;
        this.expectSpeed = value;
    }

    public setMaxSpeed(value: number) {
        this.maxSpeed = value;
    }

    private updateRotation(dt: number) {
        let dir = this.direction;
        dir = dir == 1 ? 1 : dir == 2 ? -1 : 0;

        let s = this.speed;
        this.angle += s * dt * dir;
        this.angle = this.angle % 360;
        this._updateRotation(this.angle);

        if (s > this.expectSpeed) {
            let a = this.expectSpeed - s;
            if (Math.abs(a) < 0.001)
                s = this.expectSpeed;
            else {
                a = Math.min(this.maxForce, Math.abs(a)) * (a > 0 ? 1 : a < 0 ? -1 : 0);
                s += a;
            }
        }

        s = Math.min(this.maxSpeed, s);
        this.speed = s;
    }

    private _updateRotation(angle: number) {
        this.node.setRotationFromEuler(0, 0, angle);
    }

    public reverseDirection(speed?: number) {
        const dir = this.direction;
        if (dir == 1) {
            this.direction = 2;
        }

        if (dir == 2) {
            this.direction = 1;
        }

        if (speed)
            this.speed = speed;
    }
}