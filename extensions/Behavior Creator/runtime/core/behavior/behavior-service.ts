/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:47:14
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 12:56:01
 * @Description: 
 */

import { BehaviorElement } from "./behavior-node-element";
import { BehaviorStatus } from "./behavior-status"

export class BehaviorService extends BehaviorElement {
    public getLogSymbol(){
        return "serv &$"
    }

    execute(status: BehaviorStatus) {
        status = super.execute(status);
        status = this.update(status);
        return status;
    }
}