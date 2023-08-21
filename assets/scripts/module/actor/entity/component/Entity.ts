import { Collider2D, Component, RigidBody2D, UITransform, Vec2, Vec3, _decorator, Node, Contact2DType, IPhysics2DContact, PolygonCollider2D, log } from "cc";
import { setLength } from "../../../../utils/vec2Util";
import { EntityWeapon } from "./EntityWeapon";
import { PhysicGroupIndex } from "../../../../const/PhysicGroupIndex";
import { EntityAttribute } from "../EntityAttribute";
const { ccclass, property } = _decorator;

const v2 = new Vec2();
const v2_2 = new Vec2();
const v3 = new Vec3();

@ccclass("Entity")
export class Entity extends Component {

    @property(Node)
    public body: Node = null;
    private _bodyTrans: UITransform = null;
    @property(RigidBody2D)
    public rigidBody: RigidBody2D = null;
    @property(Collider2D)
    public collider: Collider2D = null;
    @property(EntityAttribute)
    attr: EntityAttribute = new EntityAttribute();

    public weapon: EntityWeapon = null;

    @property
    public isRole: boolean = false;
    @property
    private _entityId: number = 0;
    @property
    get entityId() {
        return this._entityId;
    }
    set entityId(value: number) {
        this._entityId = value;
    }

    private _tempPos: Vec2 = new Vec2();

    protected onLoad(): void {
        this._bodyTrans = this.body.getComponent(UITransform);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.collider.on(Contact2DType.END_CONTACT, this.onEndContack, this)
    }

    private _getPosition(out: Vec2, node: Node = this.node) {
        node.getPosition(v3);
        out.set(v3.x, v3.y);
    }

    private _getWorldPosition(out: Vec2, node: Node = this.node) {
        node.getWorldPosition(v3);
        out.set(v3.x, v3.y);
    }

    public setWeapon(weapon: EntityWeapon, linkLength: number) {
        let preWeapon = this.weapon;
        if (preWeapon) {
            preWeapon.destroy();
        }

        this.weapon = weapon

        if (weapon) {
            weapon.rotator.speed = this.attr.weaponAngleSpeed;
            weapon.setRadius(this.getBodyRadius() + linkLength)
        }
    }

    public getBodyRadius() {
        if (!this._bodyTrans)
            return 0;

        let contentSize = this._bodyTrans.contentSize;
        return Math.max(contentSize.width, contentSize.height) / 2;
    }

    protected update(dt: number): void {
        if (this.isRole) {
            let x = A1.input.getAxis("Horizontal");
            let y = A1.input.getAxis("Vertical");
            v2.set(x, y);
            setLength(v2, v2, this.attr.maxMoveSpeed);
            this.rigidBody.linearVelocity = v2;

            let scalex = this.body.getScale(v3).x
            if (v2.x > 0)
                scalex = Math.abs(scalex);
            else if (v2.x < 0)
                scalex = -Math.abs(scalex);
            this.body.setScale(scalex, 1, 1)
        }

        let weapon = this.weapon;
        if (weapon) {
            this._getPosition(this._tempPos)
            weapon.node.setPosition(this._tempPos.x, this._tempPos.y);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let otherGroup = otherCollider.group;
        if (otherGroup == PhysicGroupIndex.Weapon) {
            if (!this.isRole) {
                let actor = A1.actorManager.getWeaponOwer(otherCollider);
                if (!actor || actor.node == selfCollider.node)
                    return;

                this._getWorldPosition(v2, selfCollider.node);
                this._getWorldPosition(v2_2, actor.node);
                Vec2.subtract(v2, v2, v2_2);
                setLength(v2, v2, actor.attr.weaponBeatback);
                log(`Monster is hit began. impulse x:${v2.x} y:${v2.y}`);
                this.rigidBody.applyLinearImpulse(v2, this.rigidBody.getWorldCenter(v2_2), true);
            }
        }
    }

    private onEndContack(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let otherGroup = otherCollider.group;
        if (otherGroup == PhysicGroupIndex.Weapon) {
            if (!this.isRole) {
                log("Monster is hit ended.");
            }
        }
    }
}