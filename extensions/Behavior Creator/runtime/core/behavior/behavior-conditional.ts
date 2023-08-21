/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:47:14
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 21:02:40
 * @Description: 条件装饰器
 * https://docs.unrealengine.com/4.26/zh-CN/InteractiveExperiences/ArtificialIntelligence/BehaviorTrees/BehaviorTreeNodeReference/BehaviorTreeNodeReferenceDecorators/
 */

import { BehaviorDecorator } from "./behavior-decorator";
import { BehaviorStatus } from "./behavior-status"

export class BehaviorConditional extends BehaviorDecorator{
    isCondition = true;

    public getLogSymbol(){
        return "cond &?"
    }
}