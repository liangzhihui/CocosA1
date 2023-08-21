/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-21 21:52:56
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-08-26 09:54:48
 * @Description: 
 */

import { Node } from "cc";
import * as bt  from "../../core/main";

@bt.ccclass('bt.Service')
@bt.delegate(['onUpdate'])
export class Service extends bt.BehaviorService {
	// constructor(parameters) {
	// 	super(parameters);
	// }
}