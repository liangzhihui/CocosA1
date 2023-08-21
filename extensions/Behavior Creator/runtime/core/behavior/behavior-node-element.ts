/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:47:14
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-19 14:52:02
 * @Description: 节点附加元素。元素只能附加到 entity 节点上。
 */

import { BehaviorNode } from "./behavior-node"
import { BehaviorStatus } from "./behavior-status"
import { IElementConfig, IElementInfo, INodeInfo } from "./behavior-node-interface";
import { BehaviorEntity } from "./behavior-node-entity";
import { IBehaviorTree } from "./behavior-tree-interface";

export class BehaviorElement extends BehaviorNode {
    /** element(附属节点) 元素的拥有者 */
    owner: BehaviorEntity = null;
    
    isCondition = false;
    isInterrupter = false;

    get parent(){
        return this._parent as BehaviorEntity;
    };

    get nodeInfo() {
        return this._nodeInfo as IElementInfo;
    }
    
    get nodeConfig() {
        return this._nodeConfig as IElementConfig;
    }

    constructor(parent: BehaviorEntity, nodeInfo: INodeInfo, context: IBehaviorTree) {
        super(parent, nodeInfo, context);
        this._parent = parent.parent;
        this.owner = parent;
    }

    public getLogSymbol(){
        return "elem &-"
    }

    execute(status: BehaviorStatus) {
        status = this.update(status);
        this.status = status = super.execute(status);
        return status;
    }

    executeDecorator(status: BehaviorStatus){
        if(status == BehaviorStatus.None){
            //装饰器默认都返回 Failure ，需要 execute 处理
            status = BehaviorStatus.Failure;
        }
        this.enter();
        this.enable();
        status = this.execute(status);
        this.disable(); 
        this.exit();
        return status;
    }

    executeInterrupt(parent: BehaviorEntity, child: BehaviorEntity): BehaviorStatus{
        return BehaviorStatus.Failure;
    }
}