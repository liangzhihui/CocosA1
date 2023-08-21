/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:47:14
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-26 17:16:25
 * @Description: 
 */

import { SharedNumber } from "../blackboard/shared-number";
import { BehaviorComposite } from "./behavior-composite";
import { BehaviorStatus } from "./behavior-status";

export class BehaviorParallel extends BehaviorComposite {
    //0 全部成功 -1 全部失败  XXX 指定数目
    threshold: SharedNumber = null;
    
    _cacheStatus: Array<BehaviorStatus> = [];

    constructor(parent, config, context) {
        super(parent, config, context)
        this._cacheStatus = [] // children执行状态Cache
    }

    public getLogSymbol(){
        return "para *="
    }

    update(status: BehaviorStatus) {
        let entity = this.interrupt();
        if(entity){
        }
        
        let threshold = this.threshold && typeof this.threshold.value == 'number' ? this.threshold.value : 0;
        if (threshold == 0 || threshold > this.children.length) {
            threshold = this.children.length
        }
        else if(threshold < 0){
            threshold = 0
        }

        // 执行子节点
        let success = 0
        let running = 0
        for (let i = 0; i < this.children.length; i++) {
            if (this._cacheStatus[i] == null || this._cacheStatus[i] === BehaviorStatus.Running) {
                status = this.children[i].execute()
                this._cacheStatus[i] = status
                if (status === BehaviorStatus.Running) {
                    running++
                }
            }

            if (this._cacheStatus[i] === BehaviorStatus.Success) {
                success++
            }
        }

        if (running === 0) {
            status = (success === threshold) ? BehaviorStatus.Success : BehaviorStatus.Failure
        } else {
            status = BehaviorStatus.Running
        }

        return super.update(status);
    }

    interrupt(){
        const running = this._cacheStatus.filter((status)=>{
            return status == BehaviorStatus.Running;
        })
        // 执行子节点中断评估
        if(this.interrupters.size>0 && running.length>0){
            for(let i=0; i<this.children.length; i++){
                const child = this.children[i];
                if(child.status!=BehaviorStatus.Running){
                    for (const element of this.interrupters) {
                        let status = element.executeInterrupt(this, child);
                        if(status == BehaviorStatus.Success){
                            this.abort();
                            // Sequence 序列节点，需要从 0 开始重新执行
                            // this.lastRunning = i;
                            return child;
                        }
                    }
                }
            }
        }

        return null;
    }

    abort(){
        if(this._cacheStatus.length > 0){
            for (let index = 0; index < this._cacheStatus.length; index++) {
                const status = this._cacheStatus[index];
                if(status == BehaviorStatus.Running){
                    this._cacheStatus[index] = BehaviorStatus.None;
                    this.children[index].abort();
                }
            }
            this._cacheStatus.length = 0;
        }

        return super.abort();
    }

    reset(){
        super.reset();
        this._cacheStatus.length = 0
    }
}