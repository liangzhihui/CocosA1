/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-14 12:13:53
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 13:52:20
 * @Description: 
 */
import * as bt from "../main"

// @bt.ccclass("TestDecorator")
export class TestDecorator extends bt.Decorator {
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