import { Collider2D } from 'cc';
import { Contact2DType } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { PhysicGroupIndex } from '../../const/PhysicGroupIndex';
import { IPhysics2DContact } from 'cc';
import { EntityBornData } from '../actor/entity/EntityBornData';
import { EntitySide } from '../../const/EntityConst';
import { BehaviorManager } from '../../../../extensions/Behavior Creator/runtime/main';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends Component {

    @property(Collider2D)
    public finalCollider: Collider2D = null;

    @property(EntityBornData)
    public roleBornData: EntityBornData = EntityBornData.create(EntitySide.Our);

    @property([EntityBornData])
    public enemyBornData: EntityBornData[] = [];

    protected onLoad(): void {
        A1.level = this;
        BehaviorManager.getInstance().enabled = false;
    }

    protected start() {
        this.finalCollider.on(Contact2DType.BEGIN_CONTACT, this.onFinalBeginContact, this);
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

    /** 开始关卡 */
    public startLevel() {
        A1.actorManager.createActor(this.roleBornData);
        BehaviorManager.getInstance().enabled = true;
    }

    /** 重置关卡 */
    public resetLevel() {
        A1.actorManager.removeAllActors();
        BehaviorManager.getInstance().enabled = false;
    }
}

