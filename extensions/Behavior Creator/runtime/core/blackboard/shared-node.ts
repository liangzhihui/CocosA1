/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-12 09:30:24
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-18 15:46:40
 * @Description: 
 */
import { _decorator } from 'cc';
const {ccclass} = _decorator;

import { Node } from 'cc';
import { SharedVariable } from "./shared-variable";

@ccclass("bt.SharedNode")
export class SharedNode extends SharedVariable<Node> {
    get value(): Node {
        return this.getValue();
    }
    set value(v: Node){
        this.setValue(v);
    }
}