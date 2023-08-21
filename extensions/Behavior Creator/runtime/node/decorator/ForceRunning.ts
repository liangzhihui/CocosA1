/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-26 12:11:26
 * @Description: 强制返回 Running
 */

import { Node } from "cc";
import * as bt from "../../core/main";
import { BehaviorStatus } from "../../core/main";
// const { Behavior } = Node;

@bt.ccclass('bt.ForceRunning')
export class ForceRunning extends bt.BehaviorDecorator {
	execute(status: bt.BehaviorStatus): BehaviorStatus {
		status = BehaviorStatus.Running;
		return super.execute(status);
	}
}