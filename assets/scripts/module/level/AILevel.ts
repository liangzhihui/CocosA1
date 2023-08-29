import { _decorator, Component } from "cc";
import { Level } from "./Level";
import { math } from "cc";
import { BehaviorStatus, BehaviorTree } from "../../../../extensions/Behavior Creator/runtime/main";
const { ccclass } = _decorator;

@ccclass("AILevel")
export class AILevel extends Component {

    private level: Level = null;
    private btree: BehaviorTree = null;
    private enemyBornDataIndex = 0;

    onLoad() {
        this.level = this.node.parent.getComponent(Level);
        this.btree = this.node.parent.getComponent(BehaviorTree);
    }

    /** 创建敌人 */
    public createEnemy() {
        let level = this.level;
        let enemyBornData = level.enemyBornData[this.enemyBornDataIndex];
        this.enemyBornDataIndex = (this.enemyBornDataIndex + 1) % level.enemyBornData.length;
        A1.actorManager.createActor(enemyBornData);

        return BehaviorStatus.Success;
    }

    /** 敌人数不足 */
    public onEnemyFewer(btNode, status: BehaviorStatus, param: string) {
        let model = A1.actorManager.model;
        let actorCount = Object.keys(model.actors).length;

        let v = +param;
        if (!isNaN(v) && v > 0) {
            if (actorCount < v) {
                return BehaviorStatus.Success;
            }
        }

        return BehaviorStatus.Failure;
    }
}