import { _decorator, Node, Component, Vec2 } from "cc";
import { Entity } from "../actor/entity/component/Entity";
import { BehaviorStatus } from "../../../../extensions/Behavior Creator/runtime/main";
import { ActorManager } from "../actor/ctrl/ActorManager";
import { isValid } from "cc";
import { BulletDamager } from "../bullet/BulletDamager";
const { ccclass } = _decorator;

const v2 = new Vec2();
const v2_2 = new Vec2();

@ccclass("AIEnemy")
export class AIEnemy extends Component {

    public entity: Entity = null;
    public target: Entity = null;

    protected onLoad(): void {
        this.entity = this.node.parent.getComponent(Entity);
        this.target = A1.actorManager.model.role;
        A1.actorManager.node.on(ActorManager.EventType.addActor, this._onAddActor, this);
        A1.actorManager.node.on(ActorManager.EventType.removeActor, this._onRemoveActor, this);
        A1.actorManager.node.on(ActorManager.EventType.removeAllActor, this._onRemoveAllActor, this);
    }

    protected onDestroy(): void {
        if (isValid(A1.actorManager)) {
            A1.actorManager.node.off(ActorManager.EventType.addActor, this._onAddActor, this);
            A1.actorManager.node.off(ActorManager.EventType.removeActor, this._onRemoveActor, this);
            A1.actorManager.node.off(ActorManager.EventType.removeAllActor, this._onRemoveAllActor, this);
        }
    }

    canAttack() {
        if (!this.target || !this.entity || !this.entity.weapon) {
            return BehaviorStatus.Failure;
        }

        this.entity.getPosition(v2);
        this.target.getPosition(v2_2);
        let d = Vec2.distance(v2, v2_2);
        if (d < this.entity.weapon.getAttackRange()) {
            return BehaviorStatus.Success
        }
        return BehaviorStatus.Failure;
    }

    onHasSight() {
        if (!this.target || !this.entity)
            return BehaviorStatus.Failure;

        this.entity.getPosition(v2);
        this.target.getPosition(v2_2);
        // let d = Vec2.distance(v2, v2_2);

        if (Math.abs(v2_2.x - v2.x) < this.entity.sight) {
            return BehaviorStatus.Success;
        }

        return BehaviorStatus.Failure;
    }

    onMoveToAttack() {
        if (!this.target || !this.entity) {
            return BehaviorStatus.Failure;
        }

        if (this.canAttack() == BehaviorStatus.Success) {
            this.entity.setTargetNode(null);
            return BehaviorStatus.Failure;
        }

        this.entity.setTargetNode(this.target.node);
        return BehaviorStatus.Running;
    }

    onShoot() {
        let pbs = this.entity && this.entity.projecttileBulletSystem;
        if (pbs && this.target) {
            this.entity.getPosition(v2);
            v2.y += this.entity.getBodyRadius();

            this.target.getPosition(v2_2);
            v2_2.y += this.target.getBodyRadius();

            pbs.createProjectileBullet(v2, v2_2)
                .setObserver(BulletDamager.alloc(this.entity.side));
            A1.bulletManager.manager(pbs);
        }

        return BehaviorStatus.Success;
    }

    private _onAddActor(actor: Entity) {
        if (actor.isRole) {
            this.target = actor;
        }
    }

    private _onRemoveActor(entityId: number) {
        if (this.target && this.target.entityId == entityId) {
            this.target = null;
            this.entity.setTargetNode(null);
        }
    }

    private _onRemoveAllActor() {
        this.entity = null;
        this.target = null;
    }
}