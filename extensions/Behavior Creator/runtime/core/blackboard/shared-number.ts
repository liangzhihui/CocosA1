/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-12 09:30:24
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-18 15:46:25
 * @Description: 
 */
import { _decorator } from 'cc';
const {ccclass} = _decorator;

import { SharedVariable } from "./shared-variable";

@ccclass("bt.SharedNumber")
export class SharedNumber extends SharedVariable<number> {
    get value(): number {
        return this.getValue();
    }
    set value(v: number){
        this.setValue(v);
    }
}