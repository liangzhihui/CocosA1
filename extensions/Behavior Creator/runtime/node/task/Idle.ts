/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 12:58:45
 * @Description: 
 */

import * as bt from "../../core/main";

@bt.ccclass('bt.Idle')
export class Idle extends bt.BehaviorTask {
	update(status: bt.BehaviorStatus){
		status = bt.BehaviorStatus.Running;
		return this.onUpdate(status);
	}
}