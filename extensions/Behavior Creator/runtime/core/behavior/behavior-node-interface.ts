/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-11 10:03:31
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-19 10:17:33
 * @Description: 
 */

import { IBehaviorEventListener, TBehaviorEvents, TBehaviorNodeEventInterface } from "./behavior-event-declaration";
import { BehaviorStatus } from "./behavior-status";
import { IBehaviorTree } from "./behavior-tree-interface";

export interface IBehaviorNodeInterface {
    $context: IBehaviorTree;
    delegate: IBehaviorEventListener<TBehaviorNodeEventInterface>;
    parent: IBehaviorNodeInterface;
    status: BehaviorStatus;
    
    // isInterrupter: boolean;
    // isElement: boolean;
    // isCondition: boolean;

    nodeInfo: INodeInfo;
    nodeConfig: INodeConfig;
    nodeType: TNodeType;
    nodeTag: string;
    nodeOrder: number;
    nodeTitle: string;

    setLogEnabled(enabled: boolean, withChildren: boolean);
}


export type TNodeOrder = number;

export type TNodeType = "selector" | "sequence" | "parallel" | "condition" | "decorator" | "service" | "task";

export interface ILabelConfig {
    events: TBehaviorEvents,
    group: string,
    name: string,
    tag: string,
    title: string,
    order: number
    properties: {[key: string]: any},
    uuid: string,
}

export interface IElementConfig extends ILabelConfig {
    type: TNodeType,
    isCondition: boolean,
    label?: undefined,
}

export interface IEntityConfig {
	type: TNodeType,
	label: ILabelConfig,
}

export interface IElementInfo {
	type: TNodeType,
	config: IElementConfig,
}

export interface IEntityInfo {
    type: TNodeType;
    config: IEntityConfig;
    // label: any;
    // /** 平行节点可同时执行的数目 */
    // threshold: number;
    children: Array<IEntityInfo>;
    elements: Array<IElementInfo>;
}

export type INodeInfo = IElementInfo | IEntityInfo;
export type INodeConfig = IElementConfig | ILabelConfig;

export interface INodeProperty {
    default: any;
    TYPE?: string;
    path?: string;
}


