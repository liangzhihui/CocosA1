/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-12 09:30:24
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 13:52:31
 * @Description: 
 */
import { Node } from "cc";
import * as bt from "../main"

// @bt.ccclass("TestTask")
export class TestTask extends bt.Task {
    @bt.property({
        type: bt.SharedNumber,
    })
    count: bt.SharedNumber = null;

    @bt.property({
        type: bt.SharedNode,
    })
    targetShared: bt.SharedNode = null;

    @bt.property(Node)
    target: Node = null;

    load(): void {
    }
}