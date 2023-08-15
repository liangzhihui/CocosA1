import { Component, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("EntityWeaponRotator")
export class EntityWeaponRotator extends Component {

    // 旋转速度（度/每秒）
    @property
    public speed: number = 0;

    // 旋转方向 1 逆时针 2 顺时针
    @property
    public direction: number = 1;

    // 当前的旋转角度
    private angle: number = 0;

    protected update(dt: number): void {
        let dir = this.direction;
        dir = dir == 1 ? 1 : dir == 2 ? -1 : 0;
        this.angle += this.speed * dt * dir;
        this.angle = this.angle % 360
        this._updateRotation(this.angle);
    }

    public reverseDirection() {
        const dir = this.direction;
        if (dir == 1) {
            this.direction = 2;
        }

        if (dir == 2) {
            this.direction = 1;
        }
    }

    private _updateRotation(angle: number) {
        this.node.setRotationFromEuler(0, 0, angle);
    }
}