/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 12:58:35
 * @Description: 
 */

import { Node } from "cc";
import * as bt from "../../core/main";
// const { Behavior } = Node;

@bt.ccclass('bt.Repeater')
export class Repeater extends bt.BehaviorDecorator {
	@bt.property({
		tooltip: "Repeat times / 重复次数"
	})
	times: number = 0;

	private current = 0;

	reset(){
		super.reset();
		this.current = 0;
	}

	execute(status: bt.BehaviorStatus): bt.BehaviorStatus {
		if(!this.checkValid(status)){
			//运行中的任务强行返回 Success
			if(status == bt.BehaviorStatus.Running){
				status = bt.BehaviorStatus.Success;
			}
		}
		else{
			status = bt.BehaviorStatus.Running;
		}
		
		return super.execute(status);
	}

	protected checkValid(status: bt.BehaviorStatus): boolean {
		//默认值为0，表示无限重复
		if(this.times == 0){
			return true;
		}

		this.current++;
		if(this.times>this.current){
			return true;
		}
		else{
			return false;
		}
	}

	getAppendedLog(stage: string, status?: bt.BehaviorStatus){
		if(stage=='execute'){
			return `[ Repeat times: ${this.current} / ${this.times} ]`;
		}

		return '';
	}
}