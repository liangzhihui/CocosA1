import { Vec2 } from "cc";
import { IBulletObserver } from "./BulletObserver";

export class Bullet {

    pos: Vec2 = new Vec2();
    lastPos: Vec2 = new Vec2();
    targetPos: Vec2 = new Vec2();
    speed: Vec2 = new Vec2();
    accel: Vec2 = new Vec2();
    size: number;
    energy: number;
    resUrl: string;
    model: string;
    observer: IBulletObserver;
    private _currVec: Vec2 = new Vec2();

    getPos() { return this.pos; }
    getLastPos() { return this.lastPos; }
    getTargetPos() { return this.targetPos; }
    getSpeed() { return this.speed; }
    getAccel() { return this.accel; }
    getSize() { return this.size; }
    getEnergy() { return this.energy; }
    getObserver() { return this.observer; }
    setObserver(observer: IBulletObserver) {
        this.observer = observer;
    }
    getCurrVec() {
        const size = this.getSize();
        const halfSize = size * 0.5;
        const currVec = this._currVec;
        currVec.x = this.pos.x + halfSize - 0.5;
        currVec.y = this.pos.y + halfSize - 0.5;
        return currVec;
    }

    static create() {
        return new Bullet();
    }
}