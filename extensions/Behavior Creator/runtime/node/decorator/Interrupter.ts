/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-05-26 09:55:16
 * @Description: 当监听的条件节点状态发生改变时产生中断
 */

import * as bt from "../../core/main";

@bt.ccclass('bt.Interrupter')
export class Interrupter extends bt.BehaviorDecorator {
	isInterrupter = true;
	
	@bt.property({
		type: bt.EAbortType,
		tooltip: "中断类型（Self：中断自身分支；LowerPriority：中断低优先级的兄弟分支）"
	})
	abortType = bt.EAbortType.None;

	public getLogSymbol(){
        return "inte &!"
    }

	load(): void {
		super.load();

		if(this.abortType == bt.EAbortType.LowerPriority || this.abortType == bt.EAbortType.Both){
			this.parent.addInterrupter(this);
		}
		if(this.abortType == bt.EAbortType.Self || this.abortType == bt.EAbortType.Both){
			this.owner.addInterrupter(this);
		}
	}
	destroy(): void {
		super.destroy();
	}
	
	execute(status: bt.BehaviorStatus): bt.BehaviorStatus {
		return super.execute(status);
	}

	executeInterrupt(parent: bt.BehaviorEntity, child: bt.BehaviorEntity){
		this.enter();
        this.enable();
		
		let status = bt.BehaviorStatus.Failure;
		
		if(this.owner == parent || this.owner == child){
			status = child.checkCondition(status);
		}

		this.execute(status);
		
        this.disable(); 
        this.exit();
		
		return status;
	}
}