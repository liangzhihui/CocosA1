import { Vec2 } from "cc";
import { kBulletSystemState } from "../../const/BulletConst";
import { swap } from "../../utils/arrayUtil";
import { assert } from "../../utils/debugUtil";
import { Bullet } from "./Bullet";
import { zero } from "../../utils/vec2Util";

export class BulletSystem {
    state: kBulletSystemState;

    bullets: Bullet[];
    aliveBulletCount: number;
    bulletEnergy: number;
    bulletSize: number;
    bulletResUrl: string;
    bulletModel: string;

    getState() {
        return this.state;
    }

    getBullet(i: number) {
        return this.bullets[i];
    }

    getAliveBulletCount() {
        return this.aliveBulletCount;
    }

    getBulletCount() {
        return this.bullets.length;
    }

    setState(state: kBulletSystemState) {
        this.state = state;
    }

    setBulletEnergy(bulletEnergy: number) {
        this.bulletEnergy = bulletEnergy;
    }

    setBulletSize(bulletSize: number) {
        this.bulletSize = bulletSize;
    }

    setBulletResUrl(bulletResUrl: string) {
        this.bulletResUrl = bulletResUrl;
    }

    setBulletModel(bulletModel: string) {
        this.bulletModel = bulletModel;
    }

    constructor() {
        this.bullets = [];
        this.state = kBulletSystemState.sPlay;
        this.aliveBulletCount = 0;
        this.bulletEnergy = 0;
        this.bulletSize = 0;
        this.bulletResUrl = "";
        this.bulletModel = "";
    }

    isEmpty() {
        assert(this.aliveBulletCount >= 0);
        return this.aliveBulletCount == 0
            && this.state !== kBulletSystemState.sPause;
    }

    update() {
        if (this.state != kBulletSystemState.sPause) {
            let bullet: Bullet;
            for (let i = 0; i < this.aliveBulletCount; i++) {
                bullet = this.bullets[i];

                this.updateBullet(bullet);

                if (this.deathTest(bullet)) {

                    this.killBullet(bullet);

                    if (this.aliveBulletCount > 0) {
                        swap(this.bullets, i--, this.aliveBulletCount);
                    }
                }
            }
        }
    }

    end() {
        const bullets = this.bullets;
        for (let i = 0, l = bullets.length; i < l; i++) {
            this.disposeBullet(bullets[i]);
        }
        this.aliveBulletCount = 0;
    }

    allocBullet() {

        let b: Bullet;
        const bullets = this.bullets;
        if (this.aliveBulletCount < bullets.length) {
            b = bullets[this.aliveBulletCount];
        } else {
            b = Bullet.create();
            bullets.push(b);
        }

        ++this.aliveBulletCount;
        return b;
    }

    protected killBullet(b: Bullet) {
        this.aliveBulletCount--;
        this.disposeBullet(b);
    }

    protected initBullet(b: Bullet, pos: Vec2) {
        Vec2.copy(b.pos, pos);
        Vec2.copy(b.lastPos, b.pos);
        Vec2.copy(b.targetPos, b.pos);
        zero(b.speed);
        zero(b.accel);
        b.size = this.bulletSize;
        b.energy = this.bulletEnergy;
        b.resUrl = this.bulletResUrl;
        b.model = this.bulletModel;
    }

    protected updateBullet(b: Bullet) {
        Vec2.copy(b.lastPos, b.pos);
        Vec2.add(b.pos, b.pos, b.speed);
        Vec2.add(b.speed, b.speed, b.accel);
    }

    protected deathTest(b: Bullet) {
        return b.energy <= 0;
    }

    protected disposeBullet(b: Bullet) {
        b.setObserver(null);
    }

}