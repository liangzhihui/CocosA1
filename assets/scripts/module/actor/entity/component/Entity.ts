import { Collider2D, Component, HingeJoint2D, RigidBody2D, UITransform, Vec2, Vec3, _decorator, Node } from "cc";
import { setLength } from "../../../../utils/vec2Util";
import { EntityWeapon } from "./EntityWeapon";
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
    @property(HingeJoint2D)
    public hingeJoint: HingeJoint2D = null;

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
        this.hingeJoint.enabled = false;
        this._bodyTrans = this.body.getComponent(UITransform);
    }

    private _getPosition(out: Vec2) {
        this.node.getPosition(v3);
        out.set(v3.x, v3.y);
    }

    private _setPosition(pos: Vec2) {
        v3.set(pos.x, pos.y, 0)
        this.node.setPosition(v3);
    }

    public move(vec: Vec2) {
        this._getPosition(this._tempPos);
        this._tempPos.add(vec);
        this._setPosition(this._tempPos);
    }

    public setWeapon(weapon: EntityWeapon, linkLength: number) {
        this.weapon = weapon
        if (weapon) {
            this.hingeJoint.connectedBody = weapon.rigidBody;
            this.hingeJoint.connectedAnchor.x = this.getBodyRadius() + weapon.getBodyRadius() + linkLength;
            this.hingeJoint.connectedAnchor.y = 0;
            this.hingeJoint.enableMotor = true;
            weapon.setHingeJoint(this.hingeJoint);
        } else {
            this.hingeJoint.connectedBody = null;
        }

        this.scheduleOnce(() => {
            this.hingeJoint.enabled = !!this.weapon;
        });
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
                this.move(v2);
            }
        }
    }

}