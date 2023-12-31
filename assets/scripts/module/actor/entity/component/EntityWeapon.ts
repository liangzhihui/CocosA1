import { Collider2D, Component, RigidBody2D, _decorator, Node, UITransform, Contact2DType, IPhysics2DContact } from "cc";
import { EntityWeaponRotator } from "./EntityWeaponRotator";
import { PhysicGroupIndex } from "../../../../const/PhysicGroupIndex";
import { EntitySide } from "../../../../const/EntityConst";
const { ccclass, property } = _decorator;

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

    private _side: EntitySide = 0;
    get side() { return this._side; }
    set side(value) { this._side = value; }

    private _attackRange: number = 0;

    private _limitReverse: boolean = false;
    private setLimitReverse() {
        this._limitReverse = true;
        this.scheduleOnce(() => this._limitReverse = false);
    }

    protected onLoad(): void {
        this._bodyTrans = this.body.getComponent(UITransform);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        // this.collider.on(Contact2DType.END_CONTACT, this.onEndContack, this)
    }

    public getAttackRange() {
        return this._attackRange;
    }

    public setRadius(value: number) {
        let bodyRadius = this.getBodyRadius();
        let x = value + bodyRadius;
        this._attackRange = x + bodyRadius;
        this.rigidBody.node.setPosition(x, 0);
    }

    public getBodyRadius() {
        if (!this._bodyTrans)
            return 0;

        let contentSize = this._bodyTrans.contentSize;
        return Math.max(contentSize.width, contentSize.height) / 2;
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let otherGroup = otherCollider.group;
        if (otherGroup == PhysicGroupIndex.SceneObstacle ||
            otherGroup == PhysicGroupIndex.Weapon ||
            otherGroup == PhysicGroupIndex.Actor) {

            if (otherGroup == PhysicGroupIndex.Actor) {
                let actor = A1.actorManager.getActor(otherCollider);
                if (actor) {
                    if (actor.isDied || actor.side == this.side)
                        return;
                }
            }
            else if (otherGroup == PhysicGroupIndex.Weapon) {
                let actor = A1.actorManager.getWeaponOwer(otherCollider)
                if (actor) {
                    if (actor.isDied || actor.side == this.side)
                        return;
                }
            }

            if (this.rotator && !this._limitReverse) {
                this.setLimitReverse();
                this.rotator.reverseDirection(this.rotator.maxSpeed);
            }
        }
    }

    // private onEndContack(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    // }
}