import { Collider2D, Component, RigidBody2D, UITransform, Vec2, Vec3, _decorator, Node, Contact2DType, IPhysics2DContact, log } from "cc";
import { limit, setLength, zero } from "../../../../utils/vec2Util";
import { EntityWeapon } from "./EntityWeapon";
import { PhysicGroupIndex } from "../../../../const/PhysicGroupIndex";
import { EntityAttribute } from "../EntityAttribute";
import { rangeMap } from "../../../../utils/utils";
const { ccclass, property } = _decorator;

const v2 = new Vec2();
const v2_2 = new Vec2();
const tempPos = new Vec2();
const tempForce = new Vec2();
const tempTarget = new Vec2();
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
    public maxForce: number = 20;
    public closeDistance: number = 50;

    @property
    public isRole: boolean = false;

    @property
    private _entityId: number = 0;
    @property
    get entityId() { return this._entityId; }
    set entityId(value: number) { this._entityId = value; }

    @property
    public get findRole() { return false; }
    public set findRole(value: boolean) {
        this.setTargetNode(A1.actorManager.model.role.node);
    }

    private _velocity: Vec2 = new Vec2();
    private _accelerate: Vec2 = new Vec2();
    private _targetNode: Node = null;
    private _target: Vec2 = new Vec2();

    protected onLoad(): void {
        this._bodyTrans = this.body.getComponent(UITransform);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.collider.on(Contact2DType.END_CONTACT, this.onEndContack, this)
    }

    public getPosition(out: Vec2, node: Node = this.node) {
        node.getPosition(v3);
        out.set(v3.x, v3.y);
        return out;
    }

    public getWorldPosition(out: Vec2, node: Node = this.node) {
        node.getWorldPosition(v3);
        out.set(v3.x, v3.y);
        return out;
    }

    public setWeapon(weapon: EntityWeapon, linkLength: number) {
        let preWeapon = this.weapon;
        if (preWeapon) {
            preWeapon.destroy();
        }

        this.weapon = weapon

        if (weapon) {
            weapon.rotator.setSpeed(this.attr.weaponAngleSpeed);
            weapon.rotator.setMaxSpeed(this.attr.weaponMaxAngleSpeed);
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
            this.updateRoleControl();
            this.updateBody();
        }
        else {
            if (this._targetNode != null) {
                this.getWorldPosition(this._target, this._targetNode)
                this.updateSteerBehavior(dt);
            }
        }

        let weapon = this.weapon;
        if (weapon) {
            this.getPosition(tempPos)
            weapon.node.setPosition(tempPos.x, tempPos.y);
        }
    }

    private updateBody() {
        let scalex = this.body.getScale(v3).x;
        let v = this._velocity;
        if (v.x > 0)
            scalex = Math.abs(scalex);
        else if (v.x < 0)
            scalex = -Math.abs(scalex);
        this.body.setScale(scalex, 1, 1);
    }

    private updateRoleControl() {
        let x = A1.input.getAxis("Horizontal");
        let y = A1.input.getAxis("Vertical");
        v2.set(x, y);
        setLength(v2, v2, this.attr.maxMoveSpeed);
        this._velocity.set(v2);
        this.rigidBody.linearVelocity = v2;
    }

    private updateSteerBehavior(dt: number) {
        this._velocity.set(this.rigidBody.linearVelocity);

        let steer = this.arrive(this._target, this.closeDistance, tempForce);
        this.applyForce(steer);

        const obstacles = A1.actorManager.model.obstacles;
        obstacles.forEach(obstacle => {
            this.getWorldPosition(tempTarget, obstacle);
            let steer = this.flee(tempTarget, 150, tempForce);
            this.applyForce(steer);
        });

        limit(this._accelerate, this._accelerate, this.maxForce);

        let v = this._velocity;
        let a = this._accelerate;
        v.add(a);

        zero(a);

        this.rigidBody.linearVelocity = v;
    }

    public applyForce(force: Vec2) {
        this._accelerate.add(force);
    }

    /** 到达目标位置 */
    public arrive(target: Vec2, closeDistance: number, outForce: Vec2) {
        this.getWorldPosition(tempPos);
        let desire = Vec2.subtract(v2, target, tempPos);
        let distance = desire.length();
        let maxSpeed = this.attr.maxMoveSpeed
        let speed = maxSpeed;
        if (distance < closeDistance) {
            speed = rangeMap(distance, 0, closeDistance, 0, maxSpeed);
        }
        desire.normalize();
        desire.multiplyScalar(speed);
        return Vec2.subtract(outForce, desire, this._velocity);
    }

    public flee(target: Vec2, closeDistance: number, outForce: Vec2) {
        this.getWorldPosition(tempPos);
        let desire = Vec2.subtract(v2, tempPos, target);
        let distance = desire.length();
        let maxSpeed = this.attr.maxMoveSpeed
        if (distance < closeDistance) {
            let speed = rangeMap(distance, 0, closeDistance, maxSpeed, 0);
            desire.normalize();
            desire.multiplyScalar(speed);
            return Vec2.subtract(outForce, desire, this._velocity);
        }
        else {
            return zero(outForce);
        }
    }

    public setTargetNode(node: Node) {
        this._targetNode = node;
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let otherGroup = otherCollider.group;
        if (otherGroup == PhysicGroupIndex.Weapon) {
            if (!this.isRole) {
                let actor = A1.actorManager.getWeaponOwer(otherCollider);
                if (!actor || actor.node == selfCollider.node)
                    return;

                this.getWorldPosition(v2, selfCollider.node);
                this.getWorldPosition(v2_2, actor.node);
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