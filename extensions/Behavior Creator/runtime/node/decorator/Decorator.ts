/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 12:58:06
 * @Description: 
 */

import { Node } from "cc";
import * as bt from "../../core/main";
// const { Behavior } = Node;

@bt.ccclass('bt.Decorator')
@bt.delegate(['onUpdate'])
export class Decorator extends bt.BehaviorDecorator {
	execute(status: bt.BehaviorStatus): bt.BehaviorStatus {
		return super.execute(status);
	}
}