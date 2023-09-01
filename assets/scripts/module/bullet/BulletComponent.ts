import { Component, _decorator, Node, Vec2, Sprite } from "cc";
import { Bullet } from "./Bullet";
import { Vec3 } from "cc";
const { ccclass, property } = _decorator;
const kGameUpdateFps = 60;
const v3 = new Vec3();
@ccclass("BulletComponent")
export class BulletComponent extends Component {
    private _bullet: Bullet;
    private _pos: Vec2 = new Vec2();
    private _speed: Vec2 = new Vec2();

    @property(Sprite)
    public body: Sprite = null;

    setBulletModel(bullet: Bullet) {
        this._bullet = bullet;
    }

    onLoad() {
        if (!!this._bullet) {
            this._init(this._bullet);
        }
    }

    _reuse(bullet: Bullet) {
        this.node.active = true;
        this._init(bullet);
    }

    reuse() {
    }

    unuse() {
        this._bullet = null;
    }

    private _init(bullet: Bullet) {
        this.setFlipX(bullet.getSpeed().x > 0);

        Vec2.copy(this._pos, bullet.getCurrVec());
        this.updatePosition(this._pos);
    }

    tickMove(keyFrame: boolean, dt: number) {
        const bullet = this._bullet;
        if (keyFrame) {
            const speed = bullet.getSpeed();
            this._speed.x = speed.x;
            this._speed.y = speed.y;

            Vec2.copy(this._pos, this._bullet.getCurrVec());
        }

        // 预判位置
        const accel = bullet.getAccel();
        const f = kGameUpdateFps * dt;
        this._speed.x += accel.x * f;
        this._speed.y += accel.y * f;
        Vec2.scaleAndAdd(this._pos, this._pos, this._speed, f)

        this.updatePosition(this._pos);
    }

    setFlipX(value: boolean) {
        this.body.node.getScale(v3);
        const scaleX = v3.x;
        if (value && scaleX > 0 || !value && scaleX < 0) {
            v3.x = -scaleX;
            this.body.node.setScale(v3);
        }
    }

    updateSelf(dt: number) {
        this.tickMove(true, dt);
    }

    updatePosition(newPos: Vec2) {
        this.node.setPosition(newPos.x, newPos.y);
    }

}