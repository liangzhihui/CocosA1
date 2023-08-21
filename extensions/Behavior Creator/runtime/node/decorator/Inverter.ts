/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 12:58:30
 * @Description: 
 */

import { Node } from "cc";
import * as bt from "../../core/main";
import { BehaviorStatus } from "../../core/main";
// const { Behavior } = Node;

@bt.ccclass('bt.Inverter')
export class Inverter extends bt.BehaviorDecorator {
	execute(status: bt.BehaviorStatus): BehaviorStatus {
		if(status == BehaviorStatus.Success){
			status = BehaviorStatus.Failure;
		}
		else if(status == BehaviorStatus.Failure){
			status = BehaviorStatus.Success;
		}
		return super.execute(status);
	}
}