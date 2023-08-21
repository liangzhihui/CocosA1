/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:26:29
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-25 10:42:47
 * @Description: 
 */

import { utils } from "../utils/utils";
import { ENotifyObserver, IBlackboard } from "./blackboard-declaration";

export class SharedVariable<T> {
    get value(): any {
        return this.getValue();
    }
    set value(v: any){
        this.setValue(v);
    }
    
    name: string = "";
    original: any;
    protected _value: any;
    protected blackboard: IBlackboard = null;
    
    constructor(blackboard: IBlackboard, name: string, value?: T){
        this.blackboard = blackboard;
        this.name = name;
        if(typeof value != 'undefined'){
            this.value = value;
        }
    }

    protected getValue(){
        return this._value;
    }
    protected setValue(v: any){
        let oldValue = this._value;
        this._value = v;
        if(typeof this.original == 'undefined' || this.original == null){
            this.original = v;
        }

        this.blackboard?.emit(ENotifyObserver.OnValueChange, this, oldValue);
    }
    reset(){
        this.value = this.original;
    }
    toString(){
        return `${this.value}`;
    }
}

export class SharedDynamic {

}
