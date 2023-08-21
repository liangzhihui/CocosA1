/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-14 12:13:53
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 21:05:13
 * @Description: 
 */
import * as bt from "../main"

// @bt.ccclass("TestCondition")
export class TestCondition extends bt.Conditional {
    @bt.property({
        type: bt.SharedNumber,
    })
    count: bt.SharedNumber = null;

    @bt.property({
        type: bt.SharedNode,
    })
    target: bt.SharedNode = null;

    load(): void {
    }
}