/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:50:54
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-07-15 09:30:18
 * @Description: 
 */

import { Node, Component, Director, director, game, _decorator } from "cc";
import { EDITOR } from "cc/env";
const { ccclass } = _decorator;
import * as core from "../core/main";
import { BehaviorStatus } from "../core/main";
const logger = console;

@ccclass("BehaviorManager")
export default class BehaviorManager extends Component {
    /** 运行 */
    running: Set<core.IBehaviorTree> = new Set();
    /** 挂起 */
    suspend: Set<core.IBehaviorTree> = new Set();

    /**
     * 行为树统一帧率
     * 默认为 cc.game.frameRate
     */
    private frameRate = 0;
    /** 期望帧率对应的每帧时间（以 s 为单位） */
    private frameTime = 0;
    /** 每帧时间增量 */
    private deltaTime = 0;

    // /** 行为树持续时间（是每帧时间增量叠加后的时间总和） */
    // private duration = 0;
    // /** 行为树 tick 次数 */
    // private ticks = 0;

    protected static _instance: BehaviorManager = null;

    static getInstance() {
        if (!BehaviorManager._instance) {
            const name = "[BehaviorManager]";          
            if (EDITOR) {
                let scene = director.getScene();
                if(!scene){
                    console.error("BehaviorManager 由 BehaviorTree 自动挂载，请勿手动调用。")
                    return;
                }
                let node = scene.getChildByName(name) as unknown as Node;
                if(!node){
                    node = new Node(name);
                    scene.addChild(node);
                }
                let component = node.getComponent(BehaviorManager);
                if(!component){
                    component = node.addComponent(BehaviorManager);
                }
                BehaviorManager._instance = component;
                director.once(Director.EVENT_BEFORE_SCENE_LAUNCH, ()=>{
                    if(BehaviorManager._instance == component){
                        BehaviorManager._instance = null;
                    }
                })
            }
            else{
                let node = new Node(name);
                let component = node.addComponent(BehaviorManager);
                BehaviorManager._instance = component;
                game.addPersistRootNode(node);
            }
        }
        return BehaviorManager._instance;
    }

    constructor() {
        super();
        // this.duration = 0
        // this.ticks = 0
        this.setFrameRate(Number(game.frameRate));
    }

    getFrameRate(){
        return this.frameRate;
    }
    /**
     * 设置行为树执行帧率，但真正的FPS还取决于 cc.game.frameRate 
     * 注意：行为树的帧率不会比 cc.game.frameRate 大
     * @param frameRate 
     */
    setFrameRate(frameRate: number){
        const gRate = Number(game.frameRate);
        if(frameRate <= 0 || frameRate > gRate){
            logger.warn("Invalid frame rate!");
            frameRate = gRate;
        }
        if(this.frameRate != frameRate){
            this.frameRate = frameRate;
            this.frameTime = (1000 / this.frameRate) / 1000 - 0.0001;

            this.running.forEach(context=>{
                if(context.getFrameRate() > this.frameRate){
                    context.setFrameRate(this.frameRate);
                }
            })

            this.suspend.forEach(context => {
                if(context.getFrameRate() > this.frameRate){
                    context.setFrameRate(this.frameRate);
                }
            })
        }
    }

    /**
     * 将行为树添加到 running 集合中
     * @param context 
     */
    runBehavior(context: core.IBehaviorTree) {
        this.resumeBehavior(context);
    }
    /**
     * 将行为树添加到集合中
     * @description context.startWhenEnabled 为 true 时，行为树添加到 running 集合，否则添加到 suspend 集合
     * @param context 
     */
    addBehavior(context) {
        if (context.startWhenEnabled) {
            this.resumeBehavior(context);
        }
        else {
            this.pauseBehavior(context);
        }
    }
    removeBehavior(context: core.IBehaviorTree) {
        if (this.running.has(context)) {
            this.running.delete(context);
        }
        if (this.suspend.has(context)) {
            this.suspend.delete(context);
        }
    }
    pauseBehavior(context: core.IBehaviorTree) {
        if (!this.suspend.has(context)) {
            context.onPause();
            this.suspend.add(context);
        }
        if (this.running.has(context)) {
            this.running.delete(context);
        }
    }
    resumeBehavior(context: core.IBehaviorTree) {
        if (!this.running.has(context)) {
            context.onResume();
            this.running.add(context);
        }
        if (this.suspend.has(context)) {
            this.suspend.delete(context);
        }
    }
    stopBehavior(context: core.IBehaviorTree) {
        if (this.running.has(context)) {
            context.onStop();
            this.running.delete(context);
        }
        if (!this.suspend.has(context)) {
            this.suspend.add(context);
        }
    }

    /**
     * 更新状态
     * @param {*} delta 上一次tick时间间隔
     */
    tick(delta: number) {
        // this.duration += delta
        // this.ticks += 1

        this.deltaTime += delta;
        if(this.deltaTime < this.frameTime){
            return;
        }

        this.running.forEach(context => {
            const status = context.onTick(delta);
            if (status != BehaviorStatus.Running) {
                if (context.restartWhenComplete) {
                    context.onRestart();
                }
                else {
                    context.onFinished();
                    this.stopBehavior(context);
                }
            }
        })

        this.deltaTime -= this.frameTime;
    }

    update(delta: number) {
        this.tick(delta);
    }

    onEnable() {
        this.suspend.forEach(context => {
            if (context.isSuspended) {
                this.resumeBehavior(context);
            }
        })
    }
    onDisable() {
        this.running.forEach(context => {
            if (context.pauseWhenDisabled) {
                this.pauseBehavior(context);
            }
        })
    }
}