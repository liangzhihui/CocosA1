import { Collider2D, Component, RigidBody2D, _decorator, Node, UITransform, Contact2DType, IPhysics2DContact, log as cclog, Vec2, game, js } from "cc";
import { EntityWeaponRotator } from "./EntityWeaponRotator";
const { ccclass, property } = _decorator;

const v2_1 = new Vec2();
const v2_2 = new Vec2();
const v2_3 = new Vec2();

function log(msg: string) {
    let totalTime: any = Math.round(game.totalTime * 1e3) / 1e3
    totalTime = totalTime.toFixed(3)
    cclog(js.formatStr("%s  %s", totalTime, msg));
}

@ccclass("EntityWeapon")
export class EntityWeapon extends Component {
    @property(Node)
    public body: Node = null;
    private _bodyTrans: UITransform = null;
    @property(RigidBody2D)
    public rigidBody: RigidBody2D = null;
    @property(Collider2D)
    public collider: Collider2D = null;
    @property(EntityWeaponRotator)
    public rotator: EntityWeaponRotator = null;

    private _limitReverse: boolean = false;
    private setLimitReverse() {
        this._limitReverse = true;
        this.scheduleOnce(() => this._limitReverse = false);

    }

    protected onLoad(): void {
        this._bodyTrans = this.body.getComponent(UITransform);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.collider.on(Contact2DType.END_CONTACT, this.onEndContack, this)
    }

    public setRadius(value: number) {
        this.body.setPosition(value + this.getBodyRadius(), 0);
    }

    public getBodyRadius() {
        if (!this._bodyTrans)
            return 0;

        let contentSize = this._bodyTrans.contentSize;
        return Math.max(contentSize.width, contentSize.height) / 2;
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        log("begin selfGroup:" + selfCollider.group + " otherGroup:" + otherCollider.group);
        if (this.rotator && !this._limitReverse) {
            this.rotator.reverseDirection();
            this.setLimitReverse();
        }
    }

    private onEndContack(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        log("end selfGroup:" + selfCollider.group + " otherGroup:" + otherCollider.group);
    }
}