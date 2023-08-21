/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 21:04:22
 * @Description: 
 */

import { Node } from "cc";
import * as bt from "../../core/main";
import { BehaviorStatus } from "../../core/main";
// const { Behavior } = Node;

@bt.ccclass('bt.ConditionalFilter')
@bt.delegate(['onUpdate'])
export class ConditionalFilter extends bt.BehaviorConditional {
	@bt.property({
		type: bt.SharedBoolean,
		tooltip: "Filter by shared variable / 根据共享变量值进行条件过滤",
	})
	
	filter: bt.SharedBoolean = null;

	execute(status: BehaviorStatus): BehaviorStatus {
		if(this.filter){
			status = this.filter?.value ? BehaviorStatus.Success : BehaviorStatus.Failure;
		}
		return super.execute(status);
	}
}