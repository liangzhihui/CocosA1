import { _decorator, Node, Component, Vec2 } from "cc";
import { Entity } from "../actor/entity/component/Entity";
import { BehaviorStatus } from "../../../../extensions/Behavior Creator/runtime/main";
import { ActorManager } from "../actor/ctrl/ActorManager";
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
    }

    protected onDestroy(): void {
        A1.actorManager.node.off(ActorManager.EventType.addActor, this._onAddActor, this);
        A1.actorManager.node.off(ActorManager.EventType.removeActor, this._onRemoveActor, this);
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
}