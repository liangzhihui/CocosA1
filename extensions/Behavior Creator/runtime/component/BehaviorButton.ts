/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-07 14:12:09
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-25 09:47:07
 * @Description: 用于在 Inspector 中显示编辑按钮
 */

import { _decorator, Component } from "cc";
const {ccclass, disallowMultiple} = _decorator;

@ccclass("BehaviorButton")
@disallowMultiple
export default class BehaviorButton extends Component {
}