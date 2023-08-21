/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 12:58:19
 * @Description: 强制返回成功
 */

import { Node } from "cc";
import * as bt from "../../core/main";
import { BehaviorStatus } from "../../core/main";
// const { Behavior } = Node;

@bt.ccclass('bt.ForceSuccessful')
export class ForceSuccessful extends bt.BehaviorDecorator {
	execute(status: bt.BehaviorStatus): BehaviorStatus {
		status = BehaviorStatus.Success;
		return super.execute(status);
	}
}