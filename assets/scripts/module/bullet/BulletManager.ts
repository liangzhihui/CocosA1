import { remove } from "../../utils/arrayUtil";
import { Bullet } from "./Bullet";
import { BulletComponent } from "./BulletComponent";
import { BulletSystem } from "./BulletSystem";
import { _decorator, Node, Component, Prefab, NodePool, instantiate as ccinstantiate } from "cc";
const { ccclass, property } = _decorator;

const EventType = {
    addBullet: "addBullet",
    removeBullet: "removeBullet",
    removeAllBullet: "removeAllBullet",
}

let pool = new NodePool(BulletComponent);

@ccclass("BulletManager")
export class BulletManager extends Component {
    static EventType = EventType;

    public bulletSystems: BulletSystem[] = [];

    @property(Node)
    public bulletLayer: Node = null;
    public bulletPrefab: Prefab = null;
    private _bulletMap: Map<Bullet, BulletComponent> = new Map();

    protected onLoad(): void {
        this.node.on(EventType.addBullet, this._onAdd, this);
        this.node.on(EventType.removeBullet, this._onRemove, this);
        this.node.on(EventType.removeAllBullet, this.removeAllBullets, this);
    }

    private _onAdd(bullet: Bullet) {
        const bulletDisplay = instantiate(this.bulletPrefab, bullet);
        this.bulletLayer.addChild(bulletDisplay.node);
        this._bulletMap.set(bullet, bulletDisplay);
    }

    private _onRemove(bullet: Bullet) {
        const bulletMap = this._bulletMap;
        if (bulletMap.has(bullet)) {
            const bulletDisplay = bulletMap.get(bullet);
            bulletMap.delete(bullet);
            if (bulletDisplay.isValid) {
                pool.put(bulletDisplay.node);
            }
        }
    }

    removeAllBullets() {
        let bulletDisplay: BulletComponent;
        for (let it = this._bulletMap.values(); bulletDisplay = it.next().value;) {
            if (bulletDisplay.isValid) {
                pool.put(bulletDisplay.node);
            }
        }
        this._bulletMap.clear();
    }


    getBulletSystems() {
        return this.bulletSystems;
    }

    update(dt: number) {
        let bs: BulletSystem;
        let bulletSystems = this.bulletSystems;
        for (let i = 0, l = bulletSystems.length; i < l; i++) {
            bs = bulletSystems[i];
            bs.update();
            if (bs.isEmpty()) {
                bs.end();
                bulletSystems[i] = null;
            }
        }
        remove(bulletSystems, null);

        let bulletDisplay: BulletComponent;
        for (let it = this._bulletMap.values(); bulletDisplay = it.next().value;) {
            if (bulletDisplay.isValid) {
                bulletDisplay.updateSelf(dt)
            }
        }
    }

    manager(bs: BulletSystem) {
        const bulletSystems = this.bulletSystems;
        if (bulletSystems.indexOf(bs) < 0) {
            bulletSystems.push(bs);
        }
    }

    end() {
        const bulletSystems = this.bulletSystems;
        while (bulletSystems.length > 0) {
            bulletSystems
                .pop()
                .end();
        }

        this.node.emit(EventType.removeAllBullet);
    }
}

function instantiate(bulletPrefab: Prefab, bullet: Bullet) {
    const bulletNode = pool.get() || ccinstantiate(bulletPrefab);
    const bulletDisplay = bulletNode.getComponent(BulletComponent);
    bulletDisplay._reuse(bullet);
    bulletDisplay.setBulletModel(bullet);
    return bulletDisplay;
}