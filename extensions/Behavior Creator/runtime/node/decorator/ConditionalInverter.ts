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

@bt.ccclass('bt.ConditionalInverter')
export class ConditionalInverter extends bt.BehaviorConditional {
	execute(status: BehaviorStatus): BehaviorStatus {
		if(status == BehaviorStatus.Success){
			status = BehaviorStatus.Failure;
		}
		else if(status == BehaviorStatus.Failure){
			status = BehaviorStatus.Success;
		}
		return super.execute(status);
	}
}