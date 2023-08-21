/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-12 09:30:24
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-20 09:34:46
 * @Description: 
 */
import { _decorator } from 'cc';
const {ccclass} = _decorator;

import { SharedVariable } from "./shared-variable";

@ccclass("bt.SharedBoolean")
export class SharedBoolean extends SharedVariable<boolean> {
    get value(): boolean {
        return this.getValue();
    }
    set value(v: boolean){
        this.setValue(v);
    }
}