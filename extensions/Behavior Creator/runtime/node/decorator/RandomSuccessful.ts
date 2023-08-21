/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-25 10:55:50
 * @Description: 随机返回成功
 */

import { Node } from "cc";
import * as bt from "../../core/main";
import { BehaviorStatus } from "../../core/main";

@bt.ccclass('bt.RandomSuccessful')
export class RandomSuccessful extends bt.BehaviorDecorator {
	@bt.property({
		tooltip: "返回成功的机率（0~1）"
	})
	percent: number = 0.5;

	execute(status: bt.BehaviorStatus): BehaviorStatus {
		if(this.percent==0){
			status = BehaviorStatus.Failure;
		}
		else if(this.percent==1){
			status = BehaviorStatus.Success;
		}
		else{
			let percent = Math.random();
			if(percent<this.percent){
				status = BehaviorStatus.Success;
			}
			else{
				status = BehaviorStatus.Failure;
			}
		}
		return super.execute(status);
	}
}