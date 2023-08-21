/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-11 09:30:37
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-26 10:49:24
 * @Description: 
 */
import { JsonAsset } from 'cc';
import { Node } from 'cc';
import { Task } from '../../node/task/Task';
import { Blackboard } from '../blackboard/blackboard';
import { TBlackboardOption } from '../blackboard/blackboard-declaration';
import { IBehaviorEventListener, TBehaviorTreeEventInterface } from './behavior-event-declaration';
import { BehaviorNode } from './behavior-node';
import { BehaviorEntity } from './behavior-node-entity';
import { IEntityInfo, TNodeOrder } from './behavior-node-interface';
import { BehaviorStatus, TBehaviorStatus } from './behavior-status';
import { BehaviorTask } from './behavior-task';

export const BT_RUNTIME_VERSION = "1.1.0";

export interface IBehaviorTree {
    /** 加载 Json 行为树 */
    loadJsonAsset(jsonAsset: JsonAsset);
    
    /**
     * 设置行为树执行帧率，但真正的FPS还取决于 cc.game.frameRate 
     * 行为树的帧率不会比 cc.game.frameRate 的值大
     * @param frameRate 
     */
    setFrameRate(frameRate: number);
    getFrameRate(): number;
    
    /** 行为树反序列化每个节点回调 */
    onDeserialize(node: BehaviorNode);

    /** 行为树根节点 */
    getRoot(): BehaviorEntity | null;

    /** 根据 tag 获取一个任务节点 */
    getTask(tag: string): Task | null;

    /** 根据 order 获取一个任务节点 */
    getTaskByOrder(order: number): Task | null;
        
    /** 行为树组件 BehaviorTree 被附加到的 cc.Node 节点 */
    getTargetRoot(): Node;

    /** 根据子节点路径获取 cc.Node 节点 */
    getTargetByPath(path: string): Node | null;

    /** 某个类型的 log 是否启用 */
    isLogEnabled(key: TBehaviorLogKey): boolean;
    
    onHandleTreeLog(msg: string): void;
    onTick(delta: number): TBehaviorStatus;
    onRestart();
    onPause();
    onResume();
    onFinished();
    onStop();
    
    /**
     * 行为树事件委托对象
     * 事件类型详见: IBehaviorTreeEventInterface
     */
    delegate: IBehaviorEventListener<TBehaviorTreeEventInterface>;
    /** 行为树执行日志粒度控制 */
    logOptions: IBehaviorLogOptions;
    /** 行为树持续时间（是每帧时间增量叠加后的时间总和） */
    duration: number;
    /** 每帧时间增量 */
    deltaTime: number;
    /** 行为树 tick 总次数 */
    ticks: number;
    /** 行为树中的所有节点(包括任务节点、组合节点、装饰器等所有节点) */
    allNodes: Array<BehaviorNode>;
    /** 行为树中的所有任务节点*/
    allTasks: Array<BehaviorTask>;

    /** 行为树使用的黑板变量 */
    blackboard: Blackboard;
    /** 行为树当前状态 */
    status: BehaviorStatus;
    /** 行为树是否已挂起 */
    isSuspended: boolean;
    /** 行为树是否已执行结束 */
    isCompleted: boolean;
    
    startWhenEnabled: boolean;
    pauseWhenDisabled: boolean;
    restartWhenComplete: boolean;
    resetValuesOnRestart: boolean;
    logTaskChanges: boolean;
}

export interface IBehaviorLogOptions {
    /** 当任务被中止时是否打印日志 */
    logAbort: boolean;
    /** 当中断产生时是否打印日志 */
    logInterrupt: boolean;

    logExecute: boolean;
    logUpdate: boolean;

    logLoad: boolean;
    logDestroy: boolean;

    logEnter: boolean;
    logExit: boolean;

    logEnable: boolean;
    logDisable: boolean;
}

export type TBehaviorLogKey = keyof IBehaviorLogOptions;

export type TTreeAsset = {
    root: IEntityInfo;
    refs: Array<string>;
    blackboard: TBlackboardOption;
    version: string;
}
