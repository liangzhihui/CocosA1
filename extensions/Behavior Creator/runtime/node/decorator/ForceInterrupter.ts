/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 12:58:13
 * @Description: 当监听的黑板键发生变化时强制中断
 */

import { js } from "cc";
import * as bt from "../../core/main";
import { BehaviorStatus } from "../../core/main";

@bt.ccclass('bt.ForceInterrupter')
export class ForceInterrupter extends bt.BehaviorDecorator {
	@bt.property({
		type: bt.ENotifyObserver,
		tooltip: "触发时机（比较结果改变时/黑板键的值改变时）",
	})
	notifyType = bt.ENotifyObserver.OnValueChange;

	@bt.property({
		type: bt.EAbortType,
		tooltip: "中断类型（Self：中断自身分支；LowerPriority：中断低优先级的兄弟分支）"
	})
	abortType = bt.EAbortType.None;

	@bt.property({
		type: bt.EQueryKey,
		tooltip: "比较方式"
	})
	keyQuery = bt.EQueryKey.IsEqualTo;

	@bt.property({
		type: bt.SharedDynamic,
		tooltip: "用于与 {{target}} 对应黑板键的值进行比较",
	})
	targetValue = undefined as unknown as any;

	@bt.property({
		type: bt.SharedVariable,
		tooltip: "指定黑板键"
	})
	target: bt.SharedVariable<any> = null;

	private _isSet = false;
	private _isEqual = false;

	load(): void {
		super.load();

		this.$context.blackboard.on(bt.ENotifyObserver.OnValueChange, this.onValueChange, this);
		this._isSet = typeof this.target?.value != 'undefined' ? true : false;
		this._isEqual = this.target?.value == this.targetValue ? true : false;
	}
	destroy(): void {
		this.$context.blackboard.targetOff(this);
		this.reset();
		super.destroy();
	}
	reset(): void {
		this._isSet = false;
		this._isEqual = false;
	}
	protected onValueChange(shared: bt.SharedVariable<any>, oldValue: any){
		if(this.abortType === bt.EAbortType.None || !this.target){
			return;
		}

		if(this.target.name != shared.name){
			return;
		}

		//值改变时触发
		if(this.notifyType==bt.ENotifyObserver.OnValueChange){
			if(this.target.value == oldValue){
				return;
			}
		}
		//结果改变时触发
		else if(this.notifyType==bt.ENotifyObserver.OnResultChange){
			let isSet = typeof shared?.value != 'undefined' ? true : false;
			if(this.keyQuery==bt.EQueryKey.IsSet && isSet){
				if(this._isSet == isSet){
					return;
				}
			}
			else if(this.keyQuery==bt.EQueryKey.IsNotSet && !isSet){
				if(this._isSet == isSet){
					return;
				}
			}
			this._isSet = isSet;

			let isEqual = shared?.value == this.targetValue ? true : false;
			if(this.keyQuery==bt.EQueryKey.IsEqualTo && isEqual){
				if(this._isEqual == isEqual){
					return;
				}
			}
			else if(this.keyQuery==bt.EQueryKey.IsNotEqualTo && !isEqual){
				if(this._isEqual == isEqual){
					return;
				}
			}
			this._isEqual = isEqual;
		}

		if(this.abortType == bt.EAbortType.LowerPriority || this.abortType == bt.EAbortType.Both){
			this.parent.abort();
		}
		if(this.abortType == bt.EAbortType.Self || this.abortType == bt.EAbortType.Both){
			this.owner.abort();
		}
	}

	execute(status: bt.BehaviorStatus): bt.BehaviorStatus {
		return super.execute(status);
	}
}