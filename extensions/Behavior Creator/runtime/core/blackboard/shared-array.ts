/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-18 09:29:27
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-18 15:47:29
 * @Description: 
 */
import { SharedVariable } from "./shared-variable";

export class SharedArray<T> extends SharedVariable<T>{
    get value(): Array<T> {
        return this.getValue();
    }
    set value(v: Array<T>){
        this.setValue(v);
    }
}