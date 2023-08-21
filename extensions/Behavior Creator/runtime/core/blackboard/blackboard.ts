/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:26:29
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-22 14:32:10
 * @Description: 
 */

import { js, EventTarget } from "cc";
import { IBehaviorTree } from "../behavior/behavior-tree-interface";
import { IBlackboard, TBlackboardOption } from "./blackboard-declaration";
import { SharedVariable } from "./shared-variable";
const logger = console;


export type TSharedVariable = { [key: string]: SharedVariable<any> };

export class Blackboard extends EventTarget implements IBlackboard {
    /** 运行时全局静态数据（主要用于不同行为树间运行时数据共享） */
    static globalData: Map<string, any> = new Map();
    /** 运行时用户自定义数据（主要用于当前行为树运行时数据共享） */
    userData: Map<string, any> = new Map(); 

    context: IBehaviorTree = null;
    /** 编辑器内导出的共享变量 */
    variables: TSharedVariable = null;
    /** 编辑器内导出的共享变量原始数据 */
    data: TBlackboardOption = null;

    /**
     * 
     * @param data Object 必须是对象类型 
     */
    constructor(context: IBehaviorTree, data: TBlackboardOption) {
        super();
        this.init(context, data);
    }
    destroy(){
        this.clearUserData();
    }

    init(context: IBehaviorTree, data: TBlackboardOption) {
        this.context = context;
        this.data = data;

        const array = data?.variables;
        if (!array) return;

        this.variables = {};
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const property = element.value;
            if (!property?.TYPE) {
                logger.error("invalid type: ", element);
                continue;
            }

            if (!property.TYPE.startsWith("bt.Shared")) {
                logger.error("invalid type: ", element);
                continue;
            }

            let SharedClass = js.getClassByName(property.TYPE);
            if (SharedClass) {
                let shared: SharedVariable<any> = new SharedClass(this, element.name) as unknown as any;
                if (property.TYPE == "bt.SharedNode") {
                    if(property.path){
                        let node = context.getTargetByPath(property.path);
                        shared.value = node;
                    }
                }
                else {
                    shared.value = property.default;
                }

                this.variables[element.name] = shared;
            }
            else {
                logger.error("getClassByName error: ", element);
            }
        }
    }

    /**
     * 获取黑板共享变量
     * @param key 
     * @returns 
     */
    getVariable(key: string) {
        return this.variables[key];
    }

    /**
     * 设置共享变量的值 
     * variable.value = value
     * @param key 
     * @param value 
     * @returns 
     */
    setVariableValue(key: string, value: any) {
        let variable = this.getVariable(key);
        if (!variable) {
            logger.error('getVariable error: ', key);
            return;
        }
        variable.value = value;
    }

    /**
     * 获取用户自定义数据
     * （主要用于当前行为树运行时数据共享）
     * @param key 
     * @returns 
     */
    getUserData(key: string){
        let value = this.userData.get(key);
        return value;
    }
    /**
     * 设置用户自定义数据
     * （主要用于当前行为树运行时数据共享）
     * @param key 
     * @param value 
     */
    setUserData(key: string, value: any){
        this.userData.set(key, value);
    }
    /**
     * 清空用户自定义数据
     */
    clearUserData(){
        this.userData.clear();
    }

    /**
     * 获取全局静态数据
     * （主要用于不同行为树间运行时数据共享）
     * @param key 
     * @returns 
     */
    static getGlobalData(key: string){
        let value = Blackboard.globalData.get(key);
        return value;
    }
    /**
     * 设置全局静态数据
     * （主要用于不同行为树间运行时数据共享）
     * @param key 
     * @param value 
     */
    static setGlobalData(key: string, value: any){
        Blackboard.globalData.set(key, value);
    }
    /**
     * 清空全局静态数据
     */
    static clearGlobalData(){
        Blackboard.globalData.clear();
    }
}

