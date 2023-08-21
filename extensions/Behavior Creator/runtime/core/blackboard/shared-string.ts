/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-12 09:30:24
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-18 15:53:00
 * @Description: 
 */
import { _decorator } from 'cc';
const {ccclass} = _decorator;

import { SharedVariable } from "./shared-variable";

@ccclass("bt.SharedString")
export class SharedString extends SharedVariable<string> {
    get value(): string {
        return this.getValue();
    }
    set value(v: string){
        this.setValue(v);
    }
}