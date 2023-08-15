import { Collider2D, Component, RigidBody2D, _decorator, Node, UITransform, Contact2DType, IPhysics2DContact, log as cclog, HingeJoint2D, Vec2, director, game, js } from "cc";
const { ccclass, property } = _decorator;

const v2_1 = new Vec2();
const v2_2 = new Vec2();
const v2_3 = new Vec2();

function log(msg: string) {
    cclog(js.formatStr("%d  \t%s", game.totalTime, msg));
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

    public hingeJoint: HingeJoint2D = null;
    private initMotorSpeed: number = 0;
    private currMotorSpeed: number = 0;
    private _schedule = false;

    protected onLoad(): void {
        this._bodyTrans = this.body.getComponent(UITransform);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.collider.on(Contact2DType.END_CONTACT, this.onEndContack, this)
    }

    protected onDestroy(): void {
        if (this.hingeJoint) {
            if (this.hingeJoint.connectedBody == this.rigidBody)
                this.hingeJoint.connectedBody = null
        }
        this.hingeJoint = null;
    }

    public setHingeJoint(hingeJoint: HingeJoint2D) {
        this.hingeJoint = hingeJoint;
        if (this.hingeJoint) {
            this.initMotorSpeed = this.hingeJoint.motorSpeed;
            this.currMotorSpeed = this.initMotorSpeed;
        }
    }

    public getBodyRadius() {
        if (!this._bodyTrans)
            return 0;

        let contentSize = this._bodyTrans.contentSize;
        return Math.max(contentSize.width, contentSize.height) / 2;
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        log("begin selfGroup:" + selfCollider.group + " otherGroup:" + otherCollider.group);

        if (this._schedule) return;
        this._schedule = true;
        this.currMotorSpeed *= -1;
        this.hingeJoint.motorSpeed = this.currMotorSpeed;
        this.scheduleOnce(this.updateMotorSpeed, 0.1);

        // const hingeJoint = this.hingeJoint
        // if (hingeJoint && hingeJoint.enableMotor) {
        //     this.currMotorSpeed *= -1;
        //     hingeJoint.motorSpeed = this.currMotorSpeed;
        // }
        // const worldManifold = contact.getWorldManifold();
        // const vel1 = selfCollider.body.getLinearVelocityFromWorldPoint(worldManifold.points[0], v2_1);
        // const vel2 = otherCollider.body.getLinearVelocityFromWorldPoint(worldManifold.points[0], v2_2);
        // const relativeVelocity = Vec2.subtract(v2_3, vel1, vel2);
    }

    private onEndContack(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        log("end selfGroup:" + selfCollider.group + " otherGroup:" + otherCollider.group);
    }

    private updateMotorSpeed() {
        this._schedule = false;
    }
}