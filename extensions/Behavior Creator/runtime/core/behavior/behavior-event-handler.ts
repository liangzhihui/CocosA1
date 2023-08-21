/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-08 11:09:25
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-21 17:47:27
 * @Description: 
 */

import { Node, EventHandler, isValid, js } from "cc";
import { logger } from "../utils/logger";
import { BehaviorStatus } from "./behavior-status";

export class BehaviorEventHandler extends EventHandler{
	invoke(...params: any[]): BehaviorStatus{
		const target = this.target;
        if (!isValid(target)) { return; }

		//@ts-ignore
        this._genCompIdIfNeeded();
        const compType: any = js._getClassById(this._componentId);

        if(!compType){
            logger.warn("invalid component type!");
            return;
        }

        const comp = target!.getComponent(compType);
        if (!isValid(comp)) { 
            logger.warn("invalid component type!");
            return; 
        }

        const handler = comp![this.handler];
        if (typeof (handler) !== 'function') { return; }

        if (this.customEventData != null && this.customEventData !== '') {
            params = params.slice();
            params.push(this.customEventData);
        }

        let res: BehaviorStatus =  handler.apply(comp, params);
		return res;
	}
}