/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:47:14
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-04-26 17:10:32
 * @Description: 独立子节点，可直接添加到节点树上。 相对 element 元素，元素只能附加到 entity 上。
 */

import { BehaviorNode } from "./behavior-node";
import { BehaviorStatus } from "./behavior-status";
import { deserializeNode } from "./behavior-tree-utils";
import { logger } from "../utils/logger";
import { IEntityInfo, ILabelConfig, INodeInfo } from "./behavior-node-interface";
import { IBehaviorTree } from "./behavior-tree-interface";
import { BehaviorElement } from "./behavior-node-element";
import { BehaviorDecorator } from "./behavior-decorator";
import { BehaviorService } from "./behavior-service";

export class BehaviorEntity extends BehaviorNode {
    get parent(): BehaviorEntity{
        return this._parent as BehaviorEntity;
    };
    get nodeInfo() {
        return this._nodeInfo as IEntityInfo;
    }
    get nodeConfig() {
        return this._nodeConfig as ILabelConfig;
    }

    interrupters: Set<BehaviorDecorator> = new Set();
    decorators: BehaviorDecorator[] = [];
    services: BehaviorService[] = [];
    children: BehaviorEntity[] = [];

    constructor(parent: BehaviorEntity, nodeInfo: INodeInfo, context: IBehaviorTree) {
        super(parent, nodeInfo, context);
    }

    public getLogSymbol(){
        return "enti *-"
    }
    
    setLogEnabled(enabled: boolean, withChildren: boolean = false) {
        super.setLogEnabled(enabled, withChildren);

        this.decorators.forEach(v=>{
            v.setLogEnabled(enabled, withChildren);
        })
        this.services.forEach(v=>{
            v.setLogEnabled(enabled, withChildren);
        })
        if(withChildren){
            this.children.forEach(v=>{
                v.setLogEnabled(enabled, withChildren);
            })
        }
    }

    deserialize(){
        let { $context, nodeInfo } = this;
        if (nodeInfo.children) {
            for (let child of nodeInfo.children) {
                const options = child.config.label;
                if(options.uuid){
                    const instance = deserializeNode<BehaviorEntity>(this, child, $context);
                    if(instance){
                        this.children.push(instance);
                    }
                    else{
                        logger.error("Can't find class by uuid: ", options.uuid);
                    }
                }
                else{
                    logger.error("Can't find class uuid: ", options);
                }
            }
        }

        if (nodeInfo.elements) {
            for (let elem of nodeInfo.elements) {
                const options = elem.config;
                if(options.uuid){
                    const instance = deserializeNode<BehaviorElement>(this, elem, $context, true);
                    if(instance){
                        if (elem.type === 'decorator') {
                            this.decorators.push(instance)
                        } else if (elem.type === 'service') {
                            this.services.push(instance)
                        }
                    }
                    else{
                        logger.error("Can't find class by uuid: ", options.uuid);
                    }
                }
            }
        }
        super.deserialize();
    }

    destroy(){
        for (let dec of this.decorators) {
            dec.destroy()
        }
        for (let ser of this.services) {
            ser.destroy()
        }
        for (let child of this.children) {
            child.destroy()
        }
        this.decorators.length = 0;
        this.services.length = 0;
        this.children.length = 0;
        this.clearInterrupter();

        super.destroy();
    }
    reset(): void {  
        for (let dec of this.decorators) {
            dec.reset()
        }
        for (let ser of this.services) {
            ser.reset()
        }
        for (let child of this.children) {
            child.reset()
        }
        super.reset();
    }
    disable(){
        if(this.status==BehaviorStatus.Running){
            this.status = BehaviorStatus.Abort;
        }
        super.disable();
    }
    abort(){
        if(this.status==BehaviorStatus.Running){
            this.disable();
        }
        else{
            this.status = BehaviorStatus.Abort;
        }
        return this.onAbort(this.status);
    }
    onAbort(status: BehaviorStatus){
        this.logLifeStatus("abort", status);
        return status;
    }
    interrupt(){
        this.onInterrupt(this.status);
        return null;
    }
    onInterrupt(status: BehaviorStatus){
        this.logLifeStatus("interrupt", status);
        return status;
    }

    addInterrupter(node: BehaviorDecorator){
        if(!this.interrupters.has(node)){
            this.interrupters.add(node);
        }
    }
    removeInterrupter(node: BehaviorDecorator){
        if(this.interrupters.has(node)){
            this.interrupters.delete(node);
        }
    }
    clearInterrupter(){
        this.interrupters.clear();
    }

    /**
     * 节点执行逻辑。顺序为：
     * @describe 条件装饰器执行成功时：
     * @describe execute => condition(get result success) -> service -> self -> decorator => return
     * @describe 条件装饰器执行失败时：
     * @describe execute => condition(get result fail) => return
     * @param status 
     * @returns 
     */
	execute(status?: BehaviorStatus){
        if(typeof status == 'undefined'){
            status = this.status==BehaviorStatus.Running ? BehaviorStatus.Running : BehaviorStatus.None;
        }

        //如果当前节点是以打断其它节点的方式执行的，说明当前节点已经满足执行条件，这里不需要再执行条件判断了
        if(status == BehaviorStatus.Interrupting){
        }
        else{
            status = this.executeCondition(status);
            //如果节点执行条件不成功
            if(status != BehaviorStatus.Success){
                if(this.status==BehaviorStatus.Running){
                    this.status = status;
                    this.disable();
                }
                else{
                    this.status = status;
                }
                return this.status;
            }
        }

        this.enter();

        if(this.status != BehaviorStatus.Running){
            this.enable();
        }

        this.executeServices(status);

        this.status = status = this.update(status);

        this.logLifeStatus("execute");
        
        this.status = status = this.executeDecorator(status);
        
        if(status == BehaviorStatus.Running){
        }
        else{
            if(status == BehaviorStatus.Failure){  
            }
            this.disable();     
        }

        this.exit();
          
        return this.status;
    }

    /**
     * 前置条件装饰器
     * @description 主要用于判断当前节点是否可执行，比如可实现类似 ConditionalInverter.ts 中条件反转逻辑
     * @param status 
     * @returns 
     */
    protected executeCondition(status: BehaviorStatus){
        let array = this.decorators;
        if(array.length > 0){
            //装饰器的执行顺序都是从最后一个开始往上执行的
            for (let index = array.length-1; index>=0; index--) {
                const element = array[index];
                if(!element.isInterrupter && element.isCondition){
                    //将上一个 status 作为参数传入
                    //该参数使用比较灵活，视具体的 element.execute 方法实现而定
                    //比如可实现类似 ConditionalInverter 条件反转逻辑
                    status = element.executeDecorator(status);
                }
            }
        }
        else{
            //当节点没有挂载前置条件装饰器时，节点必然是可执行的
            status = BehaviorStatus.Success;
        }
        return status;
    }
    /**
     * 后置结果装饰器
     * @description 主要用于修改节点执行结果，比如可实现类似 Inverter.ts 中结果反转逻辑
     * @param status 
     * @returns 
     */
    protected executeDecorator(status: BehaviorStatus){
        let array = this.decorators;
        //装饰器的执行顺序都是从最后一个开始往上执行的
        for (let index = array.length-1; index>=0; index--) {
            const element = array[index];
            if(!element.isInterrupter && !element.isCondition){
                //将上一个 status 作为参数传入
                //该参数使用比较灵活，视具体的 element.execute 方法实现而定
                //比如可实现类似 Inverter 结果反转逻辑
                status = element.executeDecorator(status);
            }
        }
        return status;
    }
    
    /**
     * 节点服务，每次 tick 周期都会执行
     * @param status 
     */
    protected executeServices(status: BehaviorStatus){
        const array = this.services;
        for (let index = array.length-1; index>=0; index--) {
            const element = array[index];
            element.update(status);
        }
    }

    public checkCondition(status: BehaviorStatus){
        return this.executeCondition(status);
    }
}