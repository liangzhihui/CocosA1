/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-08 11:09:25
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-21 17:46:56
 * @Description: 
 */

import { logger } from "../utils/logger";
import { TBehaviorEventOption, TBehaviorEvents, TBehaviorNodeEventInterface } from "./behavior-event-declaration";
import { BehaviorEventHandler } from "./behavior-event-handler";
import { BehaviorEventTarget } from "./behavior-event-target";
import { IBehaviorNodeInterface } from "./behavior-node-interface";
import { BehaviorStatus } from "./behavior-status";
import { IBehaviorTree } from "./behavior-tree-interface";

export class BehaviorEventDelegate extends BehaviorEventTarget<TBehaviorNodeEventInterface>{
	protected _btNode: IBehaviorNodeInterface = null;
	protected _events: TBehaviorEvents = null;
	protected _context: IBehaviorTree = null;

	private _onEnterHandler: BehaviorEventHandler = null;
	private _onExitHandler: BehaviorEventHandler = null;
	private _onEnableHandler: BehaviorEventHandler = null;
	private _onDisableHandler: BehaviorEventHandler = null;
	private _onUpdateHandler: BehaviorEventHandler = null;

	constructor(btNode: IBehaviorNodeInterface, events: TBehaviorEvents, context: IBehaviorTree){
		super();

		if(!btNode || !events || !context) return;
		
		this._btNode = btNode;
		this._events = events;
		this._context = context;
		
		this._onEnterHandler = this.createHandler(events.onEnter);
		this._onExitHandler = this.createHandler(events.onExit);
		this._onUpdateHandler = this.createHandler(events.onUpdate);
		this._onEnableHandler = this.createHandler(events.onEnable);
		this._onDisableHandler = this.createHandler(events.onDisable);
	}

	protected createHandler(event: TBehaviorEventOption){
		if(!event || !event.node?.path) return null;
		let target = this._context.getTargetByPath(event.node.path);
		if(!target){
			logger.warn("getTargetByPath error: path =", event.node.path);
			return null;
		}
		let component = target.getComponent(event.component.name);
		if(!component){
			logger.warn("cann't find component by name = " + event.component.name);
			return null;
		}
		let handler = new BehaviorEventHandler();
		handler.target = target;
		handler.component = event.component.name;
		handler.handler = event.method;
		handler.customEventData = event.data;
		return handler;
	}
	
	onEnter(){
		this._onEnterHandler?.emit([this._btNode]);
		this.emit("onEnter", this._btNode);
	}
	onEnable(){
		this._onEnableHandler?.emit([this._btNode]);
		this.emit("onEnable", this._btNode);
	}
	onUpdate(status: BehaviorStatus): BehaviorStatus{
		if(this._onUpdateHandler){
			status = this._onUpdateHandler.invoke(this._btNode, status);
		}
		status = this.emit("onUpdate", this._btNode, status);
		return status;
	}
	onDisable(){
		this._onDisableHandler?.emit([this._btNode]);
		this.emit("onDisable", this._btNode);
	}
	onExit(){
		this._onExitHandler?.emit([this._btNode]);
		this.emit("onExit", this._btNode);
	}
}