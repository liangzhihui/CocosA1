/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:47:14
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 12:55:39
 * @Description: 
 */

import { BehaviorEntity } from "./behavior-node-entity";
import { BehaviorNode } from "./behavior-node"
import { BehaviorStatus } from "./behavior-status"

export class BehaviorTask extends BehaviorEntity {
    public getLogSymbol(){
        return "task **"
    }

    update(status: BehaviorStatus) {
        //任务的默认实现直接返回 Failure，所以，在编辑器中使用 Task 节点时，必须指定 onUpdate Delegate
        status = BehaviorStatus.Failure;
        return super.update(status);
    }
}
