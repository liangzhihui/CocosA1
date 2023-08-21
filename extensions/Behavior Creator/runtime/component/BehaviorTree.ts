/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-07 14:12:09
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-26 10:51:23
 * @Description: 
 */

import { _decorator, Component, JsonAsset } from "cc";
import { DEV } from "cc/env";
const { ccclass, property, requireComponent, disallowMultiple } = _decorator;


import * as btNode from "../node/main";
import * as btCore from "../core/main";
import { BehaviorEntity, IBehaviorTree, Blackboard, logger, BehaviorStatus, TTreeAsset, BehaviorNode, BehaviorTask, BehaviorEventTarget, TBehaviorTreeEventInterface } from "../core/main";

import BehaviorLogOptions, { DefaultLogOptions } from "./BehaviorLogOptions";
import BehaviorManager from "./BehaviorManager";
import { game } from "cc";

@ccclass("BehaviorTree")
// @requireComponent(BehaviorButton)
@requireComponent(BehaviorLogOptions)
@disallowMultiple
export default class BehaviorTree extends Component implements IBehaviorTree {
    @property({
        type: JsonAsset,
        tooltip: "绑定行为树编辑器数据资源"
    })
    jsonAsset: JsonAsset = null;

    @property({
        tooltip: `设置当前行为树执行帧率，为 0 表示与 BehaviorManager.frameRate 保持一致。
                如需统一设置帧率，可以使用 BehaviorManager.getInstance().setFrameRate(rate)。
                注意：行为树的帧率不会比 cc.game.frameRate 大`,
        min: 0,
        step: 1,
    })
    frameRate = 0;
    
    @property({
        tooltip: "节点激活时开始运行"
    })
    startWhenEnabled = true;

    @property({
        tooltip: "节点禁用时暂停运行"
    })
    pauseWhenDisabled = false;

    @property({
        tooltip: "当一次行为树全部结束时，重新开始执行该行为树"
    })
    restartWhenComplete = false;

    @property({
        tooltip: "当重新开始执行行为树时，重置各节点数据"
    })
    resetValuesOnRestart = false;

    @property({
        tooltip: "当行为树状态变动时输出日志"
    })
    logTaskChanges = false;

    /**
     * 行为树事件委托对象
     * 事件类型详见: IBehaviorTreeEventInterface
     */
    delegate: BehaviorEventTarget<TBehaviorTreeEventInterface> = new BehaviorEventTarget<TBehaviorTreeEventInterface>();
    /** 行为树执行日志粒度控制 */
    logOptions: BehaviorLogOptions = null;

    /** 行为树持续时间（是每帧时间增量叠加后的时间总和） */
    duration = 0;
    /** 每帧时间增量 */
    deltaTime = 0;
    /** 行为树 tick 总次数 */
    ticks = 0;
    
    tickLoggers: Array<string> = [];
    lastLoggers: Array<string> = [];
    /** 所有节点（包括组合节点、任务节点、装饰器等所有节点） */
    allNodes: Array<BehaviorNode> = [];
    /** 所有任务节点(key为该节点在行为树编辑器中对应的序号) */
    allTasks: Array<BehaviorTask> = [];

    /** 行为树使用的黑板变量 */
    blackboard: Blackboard = null;
    /** 行为树当前状态 */
    status: BehaviorStatus = BehaviorStatus.None;
    /** 行为树是否已挂起 */
    isSuspended: boolean = false;
    /** 行为树是否已执行结束 */
    isCompleted: boolean = false;

    protected _inited = false;
    // protected _utils: BehaviorTreeUtils = null;
    protected _root: BehaviorEntity = null;
    protected get _manager() {
        return BehaviorManager.getInstance();
    }

    onLoad() {
        if (!this.jsonAsset?.json) return;
        this.reuse();
    }
    onDestroy() {
        this.unuse();
    }

    unuse(){
        if(!this._inited){
            return;
        }

        this._inited = false;
        this.status = BehaviorStatus.None;
        this.duration = 0;
        this.ticks = 0;
        this.allNodes.length = 0;
        this.allTasks.length = 0;
        this.tickLoggers.length = 0;
        this.lastLoggers.length = 0;
        this.isSuspended = false;
        this.isCompleted = false;

        if (this._root) {
            this._root.destroy();
            this._root = null;
        }
        if (this.blackboard) {
            this.blackboard.destroy();
            this.blackboard = null;
        }
        this._manager.removeBehavior(this);
    }
    reuse(){
        this.loadJsonAsset(this.jsonAsset);
    }

    loadJsonAsset(jsonAsset: JsonAsset){
        if(!jsonAsset || !jsonAsset.json) return;

        if(this._inited) return;
        this._inited = true;

        this.setFrameRate(this.frameRate);
        this.jsonAsset = jsonAsset;
        this.logOptions = this.getComponent(BehaviorLogOptions);
        if(!this.logOptions){
            this.logOptions = this.addComponent(BehaviorLogOptions);
            for (const key in DefaultLogOptions) {
                this.logOptions[key] = !!DefaultLogOptions[key];
            }
        }

        const jsonObect = jsonAsset.json;
        const json: TTreeAsset = jsonObect as TTreeAsset;

        this.blackboard = new Blackboard(this, json.blackboard);
        if (this.loadTree(json)) {
            this._manager.addBehavior(this);
        }
    }

    private loadTree(tree: TTreeAsset) {
        if (!tree?.root) {
            logger.error('load failed -- tree is invalid')
            return false;
        }

        this._root = null;
        this.allNodes.length = 0;
        this.allTasks.length = 0;
        this.tickLoggers.length = 0;
        this.lastLoggers.length = 0;
        let successs = false;

        this.delegate.emit("onDeserializeBefore");
        // 创建根节点
        const options = tree.root.config?.label || {} as btCore.ILabelConfig;
        if (options.uuid) {
            const instance: BehaviorEntity = btCore.deserializeNode(null, tree.root, this);
            if (instance) {
                this._root = instance
                successs = true;
            }
            else {
                logger.error("Can't find class by uuid: ", options.uuid);
            }
        }
        this.delegate.emit("onDeserializeAfter");

        return successs;
    }

    getFrameRate(){
        return this.frameRate;
    }
    /**
     * 设置当前行为树执行帧率，但真正的FPS还取决于 BehaviorManager.frameRate 和 cc.game.frameRate 
     * 如需统一设置帧率，可以使用 BehaviorManager.getInstance().setFrameRate(rate)
     * 注意：行为树的帧率不会比 cc.game.frameRate 大
     * @param frameRate 
     */
    setFrameRate(frameRate: number){
        const mRate = this._manager.getFrameRate();
        if(frameRate <= 0 || frameRate > mRate){
            if(frameRate != 0){
                logger.warn(`Invalid frame rate! tree.frameRate=${frameRate}, manage.frameRate=${mRate}, game.frameRate=${game.frameRate}`);
            }
            frameRate = mRate;
        }
        this.frameRate = frameRate;
        this.frameTime = (1000 / this.frameRate) / 1000 - 0.0001;
    }
    /** 期望帧率对应的每帧时间（以 s 为单位） */
    private frameTime = 0;

    /**
     * 行为树反序列化每个节点回调
     * @param node 
     */
    onDeserialize(node: BehaviorNode) {
        this.allNodes.push(node);

        if(node instanceof btNode.Task){
            /** 开发环境下，检查任务节点的 tag 是否有重复。一般来说，tag 都是唯一的 */
            if(DEV){
                const {tag, order} = node.nodeConfig;
                if(!!tag){
                    let temp = this.getTask(tag);
                    if(temp){
                        console.warn(`The node has duplicate tags. tag:${tag}, orders:[${temp.nodeConfig.order}, ${order}]`)
                    }
                }
            }
            this.allTasks.push(node);
        }
        this.delegate.emit("onDeserialize", node);
    }

    /**
     * 行为树根节点
     * @returns 
     */
    getRoot(): btCore.BehaviorEntity | null{
        return this._root;
    }

    /**
     * 根据指定的 tag 获取某个任务 
     * @param tag string
     * @returns 
     */
    getTask(tag: string): btNode.Task | null{
        let node = this.allTasks.find(v=>v.nodeConfig.tag == tag);
        return node;
    }

    /**
     * 根据任务在行为树中的序号获取某个任务 
     * @param order number
     * @returns 
     */
    getTaskByOrder(order: number): btNode.Task | null{
        let node = this.allTasks.find(v=>v.nodeConfig.order == order);
        return node;
    }
    
    /** 行为树组件被附加到的 cc.Node 节点 */
    getTargetRoot() {
        return this.node;
    }
    
    /**
     * 根据子节点路径获取 cc.Node 节点
     * @param path 
     * @returns 
     */
    getTargetByPath(path: string){
        return btCore.getTargetByPath(this.node, path);
    }

    /** 某个类型的 log 是否启用 */
    isLogEnabled(key: btCore.TBehaviorLogKey): boolean {
        return this.logOptions[key];
    }
    
    private _isLogTaskChanged: boolean = false;
    onHandleTreeLog(msg: string){
        if(this.logTaskChanges){
            if(!this._isLogTaskChanged){
                let length = this.tickLoggers.length;
                if(this.lastLoggers.length > length){
                    let temp = this.lastLoggers[length];
                    if(temp != msg){
                        this._isLogTaskChanged = true;
                    }
                }
                else{
                    this._isLogTaskChanged = true;
                }
            }
            this.tickLoggers.push(msg);
        }
    }

    onTick(delta: number) {
        if (!this._root) {
            logger.error('tick failed -- root is null')
            return BehaviorStatus.None;
        }
        
        this.duration += delta;
        this.deltaTime += delta;
        
        if(this.deltaTime < this.frameTime){
            return this.status;
        }
        this.ticks += 1;
        
        this.tickLoggers.length = 0;
        this._isLogTaskChanged = false;
        
        this.status = this._root.execute();
        
        if(this._isLogTaskChanged){
            let msg = `[ BehaviorTree - <${this._root.nodeTitle}> onTick(${this.ticks}) : status = ${BehaviorStatus[this.status]} ]\n` + this.tickLoggers.join("\n");
            logger.log(msg);
            this.lastLoggers = this.tickLoggers;
            this.tickLoggers = [];
        }
        
        // this.deltaTime -= this.frameTime;
        this.deltaTime = 0;
        
        return this.status;
    }

    onFinished() {
        this.isCompleted = true;
    }
    onRestart() {
        this.isCompleted = false;
        if (this.resetValuesOnRestart) {
            this._root.reset();
        }
    }

    onPause() {
        this.isSuspended = true;
    };
    onResume() {
        this.isSuspended = false;
    };
    onStop() {
        this.isSuspended = false;
        this.isCompleted = false;
    }
}