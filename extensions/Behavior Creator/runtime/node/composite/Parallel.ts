/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:47:14
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-25 10:39:17
 * @Description: 
 */

import * as bt from "../../core/main";

@bt.ccclass('bt.Parallel')
export class Parallel extends bt.BehaviorParallel {
    //0 全部成功 -1 全部失败  XXX 指定数目
	@bt.property({
		type: bt.SharedNumber,
		tooltip: "0 全部成功 -1 全部失败  XXX 指定数目"
	})
    threshold: bt.SharedNumber = null;
}