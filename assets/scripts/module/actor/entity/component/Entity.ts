import { Collider2D, Component, HingeJoint2D, RigidBody2D, UITransform, Vec2, Vec3, _decorator, Node, Contact2DType, IPhysics2DContact, PolygonCollider2D } from "cc";
import { isPointInPoly, setLength, zero } from "../../../../utils/vec2Util";
import { EntityWeapon } from "./EntityWeapon";
import { PhysicGroupIndex } from "../../../../const/PhysicGroupIndex";
const { ccclass, property } = _decorator;

const v2 = new Vec2();
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

    public weapon: EntityWeapon = null;

    @property
    public maxSpeed: number = 4;
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

    private _getPosition(out: Vec2) {
        this.node.getPosition(v3);
        out.set(v3.x, v3.y);
    }

    public setWeapon(weapon: EntityWeapon, linkLength: number) {
        let preWeapon = this.weapon;
        if (preWeapon) {
            preWeapon.destroy();
        }

        this.weapon = weapon

        if (weapon) {
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
            setLength(v2, v2, this.maxSpeed);
            this.rigidBody.linearVelocity = v2;
        }

        let weapon = this.weapon;
        if (weapon) {
            this._getPosition(this._tempPos)
            weapon.node.setPosition(this._tempPos.x, this._tempPos.y);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let otherGroup = otherCollider.group;
        if (otherGroup == PhysicGroupIndex.Actor ||
            otherGroup == PhysicGroupIndex.SceneObstacle) {
        }
    }

    private onEndContack(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    }
}