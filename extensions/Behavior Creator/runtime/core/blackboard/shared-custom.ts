/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-18 09:29:27
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-18 15:46:57
 * @Description: 
 */
import { SharedVariable } from "./shared-variable";

export class SharedCustom<T> extends SharedVariable<T> {
    get value(): T {
        return this.getValue();
    }
    set value(v: T){
        this.setValue(v);
    }
}