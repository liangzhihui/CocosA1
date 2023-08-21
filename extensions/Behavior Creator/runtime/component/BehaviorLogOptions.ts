
/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-07 14:12:09
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-26 10:51:23
 * @Description: 行为树日志输出选项
 */

import { _decorator, Component } from "cc";
const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

import { IBehaviorLogOptions } from "../core/behavior/behavior-tree-interface";
import BehaviorButton from "./BehaviorButton";

export const DefaultLogOptions: IBehaviorLogOptions = {
    logAbort: true,
    logInterrupt: true,
    logExecute: true,
    
    logUpdate: false,
    
    logEnter: false,
    logExit: false,

    logEnable: false,
    logDisable: false,

    logLoad: false,
    logDestroy: false,
}

@ccclass("BehaviorLogOptions")
@requireComponent(BehaviorButton)
@disallowMultiple
export default class BehaviorLogOptions extends Component implements IBehaviorLogOptions {
    @property({
        tooltip: "当任务被中止时是否打印日志",
    })
    logAbort: boolean = true;
    
    @property({
        tooltip: "当中断产生时是否打印日志",
    })
    logInterrupt: boolean = true;

    @property
    logExecute: boolean = true;

    @property
    logUpdate: boolean = false;

    @property
    logLoad: boolean = false;

    @property
    logDestroy: boolean = false;

    @property
    logEnter: boolean = false;

    @property
    logExit: boolean = false;

    @property
    logEnable: boolean = false;

    @property
    logDisable: boolean = false;
}