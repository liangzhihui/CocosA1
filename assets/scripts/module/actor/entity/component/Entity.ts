import { Collider2D, Component, HingeJoint2D, RigidBody2D, UITransform, Vec2, Vec3, _decorator, Node, Contact2DType, IPhysics2DContact, PolygonCollider2D } from "cc";
import { setLength } from "../../../../utils/vec2Util";
import { EntityWeapon } from "./EntityWeapon";
import { PhysicGroupIndex } from "../../../../const/PhysicGroupIndex";
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
    private _moveVec: Vec2 = new Vec2();
    private _oppositeVecMap: Map<Collider2D, Vec2> = new Map();

    protected onLoad(): void {
        this._bodyTrans = this.body.getComponent(UITransform);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.collider.on(Contact2DType.END_CONTACT, this.onEndContack, this)
    }

    private _getPosition(out: Vec2) {
        this.node.getPosition(v3);
        out.set(v3.x, v3.y);
    }

    private _setPosition(pos: Vec2) {
        v3.set(pos.x, pos.y, 0)
        this.node.setPosition(v3);
    }

    public checkMove(vec: Vec2, out: Vec2) {
        out.set(vec);
        for (let [otherCollider, oppositeVec] of this._oppositeVecMap.entries()) {
            if (oppositeVec.dot(out) < 0) {
                v2.set(-oppositeVec.y, oppositeVec.x);
                out.project(v2);
            }
        }
    }

    public move(vec: Vec2) {
        this._getPosition(this._tempPos);
        this._tempPos.add(vec);
        this._setPosition(this._tempPos);
    }

    public setWeapon(weapon: EntityWeapon, linkLength: number) {
        let preWeapon = this.weapon;
        if (preWeapon) {
            preWeapon.destroy();
        }

        this.weapon = weapon

        if (weapon) {
            let weaponNode = weapon.node;
            weaponNode.setPosition(0, 0);
            this.node.addChild(weaponNode);
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
            setLength(v2, v2, this.maxSpeed * dt);
            if (!v2.equals(Vec2.ZERO)) {
                this._moveVec.set(v2);
                this.checkMove(this._moveVec, v2_2)
                this.move(v2_2);
            }
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let otherGroup = otherCollider.group;
        if (otherGroup == PhysicGroupIndex.Actor ||
            otherGroup == PhysicGroupIndex.SceneObstacle) {

            const worldManifold = contact.getWorldManifold();
            const normal = worldManifold.normal;

            this._oppositeVecMap.set(otherCollider, normal);
            // const moveVec = this._moveVec;
            // if (normal.dot(moveVec) < 0) {
            //     Vec2.negate(v2, moveVec);
            //     this.move(v2)
            // }
        }
    }

    private onEndContack(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this._oppositeVecMap.has(otherCollider)) {
            this._oppositeVecMap.delete(otherCollider);
        }
    }
}