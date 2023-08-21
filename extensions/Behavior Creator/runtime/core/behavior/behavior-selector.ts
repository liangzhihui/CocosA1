/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:47:14
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-26 17:14:42
 * @Description: 
 */

import { BehaviorComposite } from "./behavior-composite";
import { BehaviorStatus } from "./behavior-status";

export class BehaviorSelector extends BehaviorComposite {
    public getLogSymbol(){
        return "sele *?"
    }

    update(status: BehaviorStatus) {
        let entity = this.interrupt();
        if(entity){
        }

        // 执行子节点
        let start = this.lastRunning >= 0 ? this.lastRunning : 0
        this.lastRunning = -1
        for (let i=start; i < this.children.length; i++) {
            const child = this.children[i];
            if(entity && child == entity){
                status = child.execute(BehaviorStatus.Interrupting);
            }
            else{
                status = child.execute();
            }

            if (status === BehaviorStatus.Success) {
                break
            } 
            else if (status === BehaviorStatus.Running) {
                this.lastRunning = i
                break
            }
            else{
                continue;
            }
        }
        return super.update(status);
    }

    interrupt(){
        let start = this.lastRunning >= 0 ? this.lastRunning : 0
        
        // 执行子节点中断评估
        if(this.interrupters.size>0 && start>0){
            for(let i=0; i<start; i++){
                const child = this.children[i];
                for (const element of this.interrupters) {
                    if(element.owner == this || element.owner == child){
                        let status = element.executeInterrupt(this, child);
                        if(status == BehaviorStatus.Success){
                            this.abort();
                            this.lastRunning = i;
                            return child;
                        }
                        break;
                    }                
                }
            }
        }
        return null;
    }
}