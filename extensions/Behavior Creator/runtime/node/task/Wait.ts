/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-26 14:51:12
 * @Description: 
 */

import * as bt from "../../core/main";

@bt.ccclass('bt.Wait')
export class Wait extends bt.BehaviorTask {
	@bt.property({
		type: bt.SharedNumber
	})
    duration: bt.SharedNumber = null;

	_intervel: number = 0;

	update(status: bt.BehaviorStatus){
		status = bt.BehaviorStatus.Running;

		if(this.duration.original>0){
			let duration = this.duration.value;
			this._intervel += this.$context.deltaTime;
			if(this._intervel - duration >= 0){
				status = bt.BehaviorStatus.Success;
				this._intervel = 0;
			}
		}
		
		return this.onUpdate(status);
	}
}