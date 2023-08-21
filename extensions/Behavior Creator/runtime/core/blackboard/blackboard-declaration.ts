/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-20 09:28:26
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-20 14:48:14
 * @Description: 
 */

import { EventTarget, Enum } from "cc";

export const ENotifyObserver = Enum({
    OnValueChange: "OnValueChange",    //当黑板键的 value 值发生改变时
    OnResultChange: "OnResultChange",  //当黑板键的 value 值与 keyQuery 指定的比较
})

export const EAbortType = Enum({
    None: 0,
    Self: -1,           //中断自身分支
    LowerPriority: -1,  //中断低优先级的兄弟分支
    Both: -1,           //以上两者
})

export const EQueryKey = Enum({
    IsEqualTo: 0,       //黑板键的值是否与指定值相等
    IsNotEqualTo: -1,
    IsSet: -1,          //黑板键是否已指定
    IsNotSet: -1,
})

export type TSharedVariableOption = {
    name: string;
    tooltip: string;
    value: {
        default: any;
        TYPE: string;
        path?: string;
    }
}
export type TBlackboardOption = {
    variables: Array<TSharedVariableOption>;
    globals: Array<TSharedVariableOption>;
}

export interface IBlackboard extends EventTarget {
}
