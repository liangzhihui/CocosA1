import { Collider2D, Component, RigidBody2D, UITransform, Vec2, Vec3, _decorator, Node, Contact2DType, IPhysics2DContact, animation } from "cc";
import { limit, setLength, zero } from "../../../../utils/vec2Util";
import { EntityWeapon } from "./EntityWeapon";
import { PhysicGroupIndex } from "../../../../const/PhysicGroupIndex";
import { EntityAttribute } from "../EntityAttribute";
import { rangeMap } from "../../../../utils/utils";
import { removeFromParent, setRigidBodyLinearVelocity } from "../../../../utils/ccUtil";
import { EntityForward, EntitySide } from "../../../../const/EntityConst";
import { ActorAnimationGraphComponent } from "../../../../component/ActorAnimationGraphComponent";
import { ProjectileBulletSystem } from "../../../bullet/ProjectileBulletSystem";
const { ccclass, property } = _decorator;

const v2 = new Vec2();
const v2_2 = new Vec2();
const tempPos = new Vec2();
const tempForce = new Vec2();
const v3 = new Vec3();

@ccclass("Entity")
export class Entity extends Component {

    @property(Node)
    public body: Node = null;
    private _bodyTrans: UITransform = null;
    private _bodyScaleX: number = 1;
    @property(RigidBody2D)
    public rigidBody: RigidBody2D = null;
    @property(Collider2D)
    public collider: Collider2D = null;
    @property(EntityAttribute)
    public attr: EntityAttribute = new EntityAttribute();

    public projecttileBulletSystem?: ProjectileBulletSystem = null;
    public animationController?: animation.AnimationController = null;

    public weapon: EntityWeapon = null;
    public maxForce: number = 20;
    public closeDistance: number = 50;

    @property
    public isRole: boolean = false;
    public isDied: boolean = false

    @property
    private _entityId: number = 0;
    @property
    get entityId() { return this._entityId; }
    set entityId(value: number) { this._entityId = value; }

    private _foward: EntityForward = EntityForward.Left;
    get forward() { return this._foward; }
    set forward(value) { 
        this._foward = value;
        this.updateScaleWithForward();
    }

    private _side: EntitySide = 0;
    get side() { return this._side; }
    set side(value) { this._side = value; }

    private _sight: number = 0;
    get sight() { return this._sight; }
    set sight(value) { this._sight = value; }

    private _tran: UITransform = null;
    private _velocity: Vec2 = new Vec2();
    private _accelerate: Vec2 = new Vec2();
    private _targetNode: Node = null;
    private _target: Vec2 = new Vec2();

    public get transform() {
        return this._tran;
    }

    protected onLoad(): void {
        this._tran = this.node.getComponent(UITransform);
        this.animationController = this.node.getComponent(animation.AnimationController);

        this._bodyTrans = this.body.getComponent(UITransform);
        this._bodyScaleX = this.body.scale.x >= 0 ? 1 : -1;

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        // this.collider.on(Contact2DType.END_CONTACT, this.onEndContack, this)
        this.attr.on(EntityAttribute.EventType.died, this._onDied, this);
        this.node.on(ActorAnimationGraphComponent.EventType.kill, this._onKill, this);
    }

    protected start(): void {
        this.updateScaleWithForward();
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

    public setWeapon(weapon: EntityWeapon, linkLength: number)
    public setWeapon(weapon: null)
    public setWeapon(weapon: EntityWeapon, linkLength?: number) {
        let preWeapon = this.weapon;
        if (preWeapon) {
            removeFromParent(preWeapon.node, true);
        }

        this.weapon = weapon

        if (weapon) {
            weapon.side = this.side;
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
        if (this.canMove()) {
            if (this.isRole) {
                this.updateRoleControl(dt);
                this.updateForward();
            }
            else {
                if (this._targetNode != null) {
                    this.getWorldPosition(this._target, this._targetNode);
                    this.updateSteerBehavior(dt);
                }
            }
        }

        let weapon = this.weapon;
        if (weapon) {
            this.getPosition(tempPos)
            let tran = this._tran;
            weapon.node.setPosition(
                tempPos.x + (0.5 - tran.anchorX) * tran.contentSize.width,
                tempPos.y + (0.5 - tran.anchorY) * tran.contentSize.height
            );
        }

        if (this.animationController)
            this.animationController.setValue('moveSpeed', this._velocity.length());
    }

    private updateForward() {
        let v = this._velocity;
        if (v.x > 0)
            this._foward = EntityForward.Right;
        else if (v.x < 0)
            this._foward = EntityForward.Left;

        this.updateScaleWithForward();
    }

    private updateScaleWithForward() {
        let scalex = Math.abs(this.body.getScale(v3).x);
        if (this._foward == EntityForward.Left) {
            scalex = -scalex;
        }
        scalex *= this._bodyScaleX;
        this.body.setScale(scalex, 1, 1);
    }

    private updateRoleControl(dt: number) {
        let input = A1.input;
        let x = input.getAxis("Horizontal");
        let y = input.getAxis("Vertical");
        
        v2.set(x, y);
        setLength(v2, v2, this.attr.maxMoveSpeed);
        this._velocity.set(v2);
        setRigidBodyLinearVelocity(this.rigidBody, v2);
    }

    private updateSteerBehavior(dt: number) {
        this._velocity.set(this.rigidBody.linearVelocity);

        let steer = this.arrive(this._target, this.closeDistance, tempForce);
        this.applyForce(steer);

        // const obstacles = A1.actorManager.model.obstacles;
        // obstacles.forEach(obstacle => {
        //     this.getWorldPosition(tempTarget, obstacle);
        //     let steer = this.flee(tempTarget, 150, tempForce);
        //     this.applyForce(steer);
        // });

        limit(this._accelerate, this._accelerate, this.maxForce);

        let v = this._velocity;
        let a = this._accelerate;
        v.add(a);

        zero(a);

        setRigidBodyLinearVelocity(this.rigidBody, v);
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
        if (!node) {
            this.stopMove();
        }
    }

    public stopMove() {
        this._velocity.set(Vec2.ZERO);
        setRigidBodyLinearVelocity(this.rigidBody, Vec2.ZERO);
    }

    public canMove() {
        if (this.isDied) {
            return false;
        }
        return true;
    }

    public limitDecHp: boolean = false;
    public setLimitDecHp() {
        this.limitDecHp = true;
        this.scheduleOnce(() => this.limitDecHp = false, 0.1);
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.isDied)
            return;

        let otherGroup = otherCollider.group;
        if (otherGroup == PhysicGroupIndex.Weapon) {
            let actor = A1.actorManager.getWeaponOwer(otherCollider);
            if (!actor || actor.isDied || actor.node == selfCollider.node || actor.side == this.side)
                return;

            if (!this.limitDecHp) {
                this.setLimitDecHp();
                this.attr.decHp();
            }

            if (!this.isRole && !this.isDied) {
                this.stopMove();
                this.getWorldPosition(v2, selfCollider.node);
                this.getWorldPosition(v2_2, actor.node);
                Vec2.subtract(v2, v2, v2_2);
                setLength(v2, v2, actor.attr.weaponBeatback);
                this.rigidBody.applyLinearImpulse(v2, this.rigidBody.getWorldCenter(v2_2), true);
            }
        }
    }

    // private onEndContack(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    //     if (this.isDied)
    //         return;
    //     let otherGroup = otherCollider.group;
    //     if (otherGroup == PhysicGroupIndex.Weapon) {
    //         if (!this.isRole) {
    //             // log("Monster is hit ended.");
    //         }
    //     }
    // }

    private _onDied() {
        if (this.animationController) {
            this.animationController.setValue("isDead", true);
        }

        this.isDied = true;
        this.stopMove();
        this.scheduleOnce(() => {
            this.collider.enabled = false;
            this.setWeapon(null);
            if (!this.animationController)
                this._onKill();
        });
    }

    private _onKill() {
        A1.actorManager.removeActor(this.entityId);
        if (this.isRole) {
            A1.mainui.finishLevel(false);
        }
    }
}