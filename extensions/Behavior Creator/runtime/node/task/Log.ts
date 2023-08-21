/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-25 10:43:03
 * @Description: 
 */

import * as bt from "../../core/main";

@bt.ccclass('bt.Log')
@bt.delegate(['onUpdate'])
export class Log extends bt.BehaviorTask {
	@bt.property({
		type: bt.SharedString
	})
	message: bt.SharedString = null;

	update(status: bt.BehaviorStatus){
		if(this.message){
			bt.logger.log(`[${this.nodeConfig.title}]-[${this.nodeConfig.order}] : message = [${this.message.value}]`);
		}
		status = bt.BehaviorStatus.Success;
		return this.onUpdate(status);
	}
}