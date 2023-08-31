import { Collider2D, Contact2DType, isValid, Rect, UITransform, _decorator, Component, Node, IPhysics2DContact } from 'cc';
import { PhysicGroupIndex } from '../../const/PhysicGroupIndex';
import { EntityBornData } from '../actor/entity/EntityBornData';
import { EntitySide } from '../../const/EntityConst';
import { BehaviorManager } from '../../../../extensions/Behavior Creator/runtime/main';
import { ActorManager } from '../actor/ctrl/ActorManager';
import { Entity } from '../actor/entity/component/Entity';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends Component {

    @property(Collider2D)
    public finalCollider: Collider2D = null;

    @property(EntityBornData)
    public roleBornData: EntityBornData = EntityBornData.create(EntitySide.Our);

    @property([EntityBornData])
    public enemyBornData: EntityBornData[] = [];

    private _role: Entity;
    private _rect: Rect

    protected onLoad(): void {
        A1.level = this;
        let tran = this.node.getComponent(UITransform)
        this._rect = tran.getBoundingBox()
        BehaviorManager.getInstance().enabled = false;
        this.finalCollider.on(Contact2DType.BEGIN_CONTACT, this.onFinalBeginContact, this);
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

    private onFinalBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let otherGroup = otherCollider.group;
        if (otherGroup == PhysicGroupIndex.Actor) {
            let model  = A1.actorManager.model;
            if (model.role.node == otherCollider.node) {
                A1.mainui.finishLevel(true);
            }
        }
    }

    private _onAddActor(actor: Entity) {
        if (actor.isRole) {
            this._role = actor;
            A1.sceneCamera.setTarget(actor.node);
        }
    }

    private _onRemoveActor(entityId: number) {
        if (this._role && this._role.entityId == entityId) {
            A1.sceneCamera.setTarget(null);
            this._role = null;
        }
    }

    private _onRemoveAllActor() {
        this._role = null;
    }

    /** 开始关卡 */
    public startLevel() {
        A1.actorManager.createActor(this.roleBornData);
        BehaviorManager.getInstance().enabled = true;
    }

    /** 完成关卡 */
    public finishLevel(win: boolean) {
        BehaviorManager.getInstance().enabled = false;
        A1.sceneCamera.setTarget(null);

        let actors = A1.actorManager.model.actors
        for (let entityId in actors) {
            let actor = actors[entityId];
            if (actor) {
                actor.setTargetNode(null);
            }
        }
    }

    /** 重置关卡 */
    public resetLevel() {
        A1.actorManager.removeAllActors();
    }

    /** 获取关卡范围 */
    public getRect() {
        return this._rect
    }
}

