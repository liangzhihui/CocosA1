/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:43:14
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-03-22 18:11:37
 * @Description: 
 */
/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:59:27
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-03-22 14:41:21
 * @Description: 
 */

import { __private } from "cc";
// import * as _ from "../index";

declare module "cc" {
	namespace Node {
		namespace Behavior {
			
			/**
			 * @en Declare a standard class as a CCClass, please refer to the [document](https://docs.cocos.com/creator3d/manual/zh/scripting/ccclass.html)
			 * @zh 将标准写法的类声明为 CC 类，具体用法请参阅[类型定义](https://docs.cocos.com/creator3d/manual/zh/scripting/ccclass.html)。
			 * @param name - The class name used for serialization.
			 * @example
			 * ```ts
			 * import { _decorator, Component } from 'cc';
			 * const {ccclass} = _decorator;
			 *
			 * // define a CCClass, omit the name
			 *  @ccclass
			 * class NewScript extends Component {
			 *     // ...
			 * }
			 *
			 * // define a CCClass with a name
			 *  @ccclass('LoginData')
			 * class LoginData {
			 *     // ...
			 * }
			 * ```
			 */
			export const btclass: ((name?: string) => ClassDecorator) & ClassDecorator;
			/**
			 * @en Declare as a CCClass property with options
			 * @zh 声明属性为 CCClass 属性。
			 * @param options property options
			 */
			export function property(options?: __private.cocos_core_data_decorators_property_IPropertyOptions): __private.cocos_core_data_decorators_utils_LegacyPropertyDecorator;
			/**
			 * @en Declare as a CCClass property with the property type
			 * @zh 标注属性为 cc 属性。<br/>
			 * 等价于`@property({type})`。
			 * @param type A {{ccclass}} type or a {{ValueType}}
			 */
			export function property(type: __private.cocos_core_data_decorators_property_PropertyType): __private.cocos_core_data_decorators_utils_LegacyPropertyDecorator;
			/**
			 * @en Declare as a CCClass property
			 * @zh 标注属性为 cc 属性。<br/>
			 * 等价于`@property()`。
			 */
			export function property(...args: Parameters<__private.cocos_core_data_decorators_utils_LegacyPropertyDecorator>): void;
	
			export enum BehaviorStatus {
				Idle = -1,
				Failure = 0,
				Success = 1,
				Running = 2
			}
	
			type ValueOf<T> = T[keyof T];
			type TBehaviorStatus = ValueOf<typeof BehaviorStatus>;
	
			export class Manager {
				constructor (data?: any);
				load(tree);
				tick(delta: number);
				reset();
			}

			export class BehaviorNode {
				constructor (parent, config, context);
				update(delta: number): TBehaviorStatus
			}
	
			export class Decorator extends BehaviorNode {
				update(delta: number): TBehaviorStatus
			}
	
			export class Service extends BehaviorNode {
				update(delta: number): TBehaviorStatus
			}
	
			export class Task extends BehaviorNode {
				update(delta: number): TBehaviorStatus
			}
	
			export class Composite extends BehaviorNode {
				update(delta: number): TBehaviorStatus
			}
		}
	}
}
