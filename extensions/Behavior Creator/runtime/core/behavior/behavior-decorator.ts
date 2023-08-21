/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:47:14
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 12:56:35
 * @Description: 装饰器
 * https://docs.unrealengine.com/4.26/zh-CN/InteractiveExperiences/ArtificialIntelligence/BehaviorTrees/BehaviorTreeNodeReference/BehaviorTreeNodeReferenceDecorators/
 */

import { BehaviorElement } from "./behavior-node-element";
import { BehaviorStatus } from "./behavior-status"

export class BehaviorDecorator extends BehaviorElement {
    isCondition = false;

    public getLogSymbol(){
        return "deco &@"
    }
}