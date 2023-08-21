/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-08 11:09:25
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-06-06 14:45:35
 * @Description: 
 */

import { IElementConfig, ILabelConfig, INodeInfo, INodeConfig } from "./behavior-node-interface";
import { BehaviorEventDelegate } from "./behavior-event-delegate";
import { IBehaviorNodeInterface } from "./behavior-node-interface";
import { BehaviorStatus, TBehaviorStatus } from "./behavior-status";
import { IBehaviorTree, TBehaviorLogKey } from "./behavior-tree-interface";

export class BehaviorNode implements IBehaviorNodeInterface {
    $context: IBehaviorTree = null;
    delegate: BehaviorEventDelegate = null;
    status: TBehaviorStatus = BehaviorStatus.None;
    /** 父节点 */
    protected _parent: BehaviorNode = null;
    get parent(){
        return this._parent;
    }
    
    protected _nodeInfo: INodeInfo = null;
    get nodeInfo() {
        return this._nodeInfo;
    }   
    protected _nodeConfig: INodeConfig = null;
    get nodeConfig() {
        return this._nodeConfig;
    }
    get nodeType(){
        return this.nodeInfo.type;
    }
    get nodeTag(){
        return this.nodeConfig.tag;
    }
    get nodeOrder(){
        return this.nodeConfig.order;
    }
    get nodeTitle(){
        return this.nodeConfig.title;
    }

    protected _isEnabled = false;
    constructor(parent: BehaviorNode, nodeInfo: INodeInfo, context: IBehaviorTree) {
        this.$context = context;
        this._parent = parent;
        this._nodeInfo = nodeInfo;
        /** element */
        if(!nodeInfo.config.label){
            this._nodeConfig = nodeInfo.config as IElementConfig;
        }
        else{
            this._nodeConfig = nodeInfo.config.label as ILabelConfig;
        }
        if(!this._nodeConfig.tag){
            this._nodeConfig.tag = `TAG${this._nodeConfig.order}`;
        }
        this.delegate = new BehaviorEventDelegate(this, this.nodeConfig.events, context);
    }

    deserialize(){
        this.$context.onDeserialize(this);
    }

    load(){
        this.logLifeStatus("load");
    }

    destroy(){
        this.delegate = null;
        this.logLifeStatus("destroy");
    }

    enter(){
        this.logLifeStatus("enter");
        this.delegate.onEnter();
    }
    exit(){
        this.logLifeStatus("exit");
        this.delegate.onExit();
    }
    
    enable(){
        if(this._isEnabled){
            return;
        }
        this._isEnabled = true;
        this.delegate.onEnable();
        this.logLifeStatus("enable");
    }
    disable(){
        if(!this._isEnabled){
            return;
        }
        this._isEnabled = false;
        this.delegate.onDisable();
        this.logLifeStatus("disable");
    }

    update(status: BehaviorStatus): TBehaviorStatus {
        return this.onUpdate(status);
    }
    execute(status?: BehaviorStatus): TBehaviorStatus{
        return this.onExecute(status);
    }
    
    protected onUpdate(status: BehaviorStatus): TBehaviorStatus {
        status = this.delegate.onUpdate(status);
        this.logLifeStatus("update", status);
        return status;
    }
    protected onExecute(status?: BehaviorStatus): TBehaviorStatus{
        this.logLifeStatus("execute", status);
        return status;
    }

    reset() {
        this.status = BehaviorStatus.None;
    }
    
    _mapStageKey: Map<string, string> = new Map();
    protected getStageKey(stage: string): TBehaviorLogKey{
        let key = this._mapStageKey.get(stage);
        if(!key){
            key = `log${stage.substring(0, 1).toUpperCase()}${stage.substring(1)}`;
            this._mapStageKey.set(stage, key);
        }
        return key as TBehaviorLogKey;
    }
    public clearStageKey(){
        this._mapStageKey.clear();
    }

    public getLogSymbol(){
        return "node --"
    }
    public getLogPrefix(){
        return `bt-${this.getLogSymbol()} `;
    }
    
    protected isLogEnabled(stage: string){
        let key = this.getStageKey(stage);
        return this.$context.isLogEnabled(key) && this._logEnabled;
    }
    
    protected _logEnabled = true;
    /**
     * 设置节点是否可以打印log
     * @param enabled 
     * @param withChildren 是否同时设置子节点
     */
    setLogEnabled(enabled: boolean, withChildren: boolean = false) {
        this._logEnabled = enabled;
        if(withChildren){
        }
    }

    /**
     * 生命周期各阶段执行状态日志输出（内部调用）
     * @param stage 
     * @param status 
     */
    protected logLifeStatus(stage: string, status?: BehaviorStatus){
        if(typeof status == 'undefined'){
            status = this.status;
        }
        if(this.isLogEnabled(stage)){
            this.$context.onHandleTreeLog(`${this.getLogPrefix()} [${this.nodeConfig.order}]-[${stage}] [${this.nodeConfig.title}] ${BehaviorStatus[status]} ${this.getAppendedLog(stage, status)}`);
        }
    }
    /**
     * 生命周期各阶段执行状态附加日志（子类按需要重写）
     * @param stage 
     * @param status 
     * @returns 
     */
    protected getAppendedLog(stage: string, status?: BehaviorStatus){
        return '';
    }
    /**
     * 生命周期各阶段信息日志输出（可在外部按需要调用）
     * @param stage 
     * @param info 
     */
     public logLifeInfo(stage: string, info: string){
        if(this.isLogEnabled(stage)){
            this.$context.onHandleTreeLog(`${this.getLogPrefix()} [${this.nodeConfig.order}]-[${stage}] [${this.nodeConfig.title}] : info = ${info} `);
        }
    }
}
