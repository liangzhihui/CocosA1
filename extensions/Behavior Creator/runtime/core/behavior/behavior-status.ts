/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:48:12
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-19 11:29:22
 * @Description: 
 */

export enum BehaviorStatus {
    // Idle = -1,
    None = 0,
    Success,
    Failure,
    Running,
    Abort,
    Interrupting,
}

type ValueOf<T> = T[keyof T];
export type TBehaviorStatus = ValueOf<typeof BehaviorStatus>;
export type KBehaviorStatus = keyof typeof BehaviorStatus;