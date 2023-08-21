/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-08 11:09:25
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-05-17 14:44:54
 * @Description: 
 */


import { utils } from "../utils/utils";
import { IBehaviorNodeInterface } from "./behavior-node-interface";
import { BehaviorStatus } from "./behavior-status";

export function CloneEventOption(){
    return utils.clone(BehaviorEventOption);
}

export const BehaviorEventOption = {
	node: {
		// uuid: '',
		name: '',
		path: '',
	},
	component: {
		uuid: '',
		name: '',
	},
	method: '',
	data: '',
}

export type TBehaviorEventOption = typeof BehaviorEventOption;


export type AnyFunction = (...args: any[]) => any;

export type TBehaviorEventRecord<T> = {
	[key in keyof T]: T[key]
}

export type TBehaviorEventInterface = Record<string, AnyFunction>;

export interface IBehaviorTreeEventInterface {
	onDeserializeBefore: () => void;
	onDeserializeAfter: () => void;
	onDeserialize: (node: IBehaviorNodeInterface) => void;
}
export type TBehaviorTreeEventInterface = TBehaviorEventRecord<IBehaviorTreeEventInterface>;

export interface IBehaviorNodeEventInterface {
	onEnter: (node: IBehaviorNodeInterface) => void;
	onExit: (node: IBehaviorNodeInterface) => void;
	onEnable: (node: IBehaviorNodeInterface) => void;
	onDisable: (node: IBehaviorNodeInterface) => void;
	onUpdate: (node: IBehaviorNodeInterface, status: BehaviorStatus) => BehaviorStatus;
}
export type TBehaviorNodeEventInterface = TBehaviorEventRecord<IBehaviorNodeEventInterface>;

export type TDelegateEvents = keyof IBehaviorNodeEventInterface;
export type TArrayDelegateEvents = Array<TDelegateEvents>;

export type TBehaviorEvents = {
	[key in TDelegateEvents]?: TBehaviorEventOption
}

export interface IBehaviorEventListener<T extends TBehaviorEventInterface> {
	on<Key extends keyof T>(key: Key, callback: T[Key], target?: unknown, once?: boolean): AnyFunction;
	once<Key extends keyof T>(key: Key, callback: T[Key], target?: unknown): AnyFunction;
	off<Key extends keyof T> (key: Key, callback?: AnyFunction, target?: any): void;
	targetOff(typeOrTarget: any): void;
	emit<Key extends keyof T>(key: Key, ...params: Parameters<T[Key]>): ReturnType<T[Key]>;
}
