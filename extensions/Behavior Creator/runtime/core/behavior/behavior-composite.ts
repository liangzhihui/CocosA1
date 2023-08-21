/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:47:14
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-07-18 11:55:37
 * @Description: 组合节点
 * https://docs.unrealengine.com/4.26/zh-CN/InteractiveExperiences/ArtificialIntelligence/BehaviorTrees/BehaviorTreeNodeReference/BehaviorTreeNodeReferenceComposites/
 */

import { BehaviorEntity } from "./behavior-node-entity";
import { BehaviorStatus } from "./behavior-status";

export class BehaviorComposite extends BehaviorEntity {
    isComposite = true;
    lastRunning = -1;

    constructor(parent, config, context) {
        super(parent, config, context)
        this.isComposite = true
        this.lastRunning = -1 // 上一次running的索引
    }

    public getLogSymbol(){
        return "comp --"
    }

    abort(){
        if(this.lastRunning != -1){
            let child = this.children[this.lastRunning];
            this.lastRunning = -1;
            if(child){
                child.abort();
            }
        }

        return super.abort();
    }

    reset() {
        super.reset()
        this.lastRunning = -1;
    }

    disable(){
        if(this.lastRunning != -1){
            let child = this.children[this.lastRunning];
            if(child){
                child.status = this.status;
                child.disable();
            }
        }
        super.disable();
        this.lastRunning = -1;
    }
}