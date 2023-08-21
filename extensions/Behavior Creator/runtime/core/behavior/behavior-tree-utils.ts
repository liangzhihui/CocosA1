/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-04-11 09:30:37
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-05-12 10:08:35
 * @Description: 
 */
import { js, Node } from "cc";
import { logger } from "../utils/logger";
import { BehaviorNode } from "./behavior-node";
import { IElementInfo, IElementConfig, IEntityInfo, INodeProperty, IEntityConfig, ILabelConfig } from "./behavior-node-interface";
import { IBehaviorTree } from "./behavior-tree-interface";

export function getTargetByPath(node: Node, path: string){
    if(!path){
        return null;
    }
    
    return node.getChildByPath(path);
}

export function deserializeNode<T extends BehaviorNode>(parent: BehaviorNode, info: IEntityInfo | IElementInfo, context: IBehaviorTree, isElement = false): T | null{
    let config: ILabelConfig | IElementConfig;
    if(isElement){
        config = info.config as unknown as IElementConfig;
    }
    else{
        config = (info.config as IEntityConfig).label;
    }
    
    const cls = js._getClassById(config.uuid) as unknown as typeof BehaviorNode;
    if(!cls){
        return null;
    }

    let instance: T = new cls(parent, info, context) as T;
    
    let properties = config.properties;
    for (const key in properties) {
        const property: INodeProperty = properties[key];
        if(typeof instance[key] == 'undefined'){
            if(property.TYPE == "bt.SharedDynamic"){
                if(property.path){
                    instance[key] = context.getTargetByPath(property.path);
                }
                else{
                    instance[key] = property.default;
                }
            }
        }            
        else if(!property.TYPE){
            instance[key] = property.default;
        }
        else if(property.TYPE == "cc.Enum"){
            instance[key] = Number(property.default);
        }
        else if(property.TYPE == "cc.Node"){
            if(property.path){
                instance[key] = context.getTargetByPath(property.path);
            }
        }
        else{
            if(property.TYPE.startsWith("bt.Shared")){
                if(property.TYPE == "bt.SharedDynamic"){
                    if(property.path){
                        instance[key] = context.getTargetByPath(property.path);
                    }
                    else{
                        instance[key] = property.default;
                    }
                }
                else{
                    let variable = context.blackboard.getVariable(property.default);
                    instance[key] = variable;
                }
                // console.warn("SharedVariable: ", instance[key]);
            }
        }
        if(typeof instance[key] == "undefined" || instance[key] == null){
            logger.warn(`Behavior [${instance.nodeConfig.order}]-[deserialize] [${instance.nodeConfig.title}]: key=${key}, value=${instance[key]}`);
        }
    }
    instance.deserialize();
    instance.load();
    return instance;
}

export class BehaviorTreeUtils {
    // _targetNodes: Map<string, Node> = null;

    // constructor(){
    //     this._targetNodes = new Map();
    // }

    // setTarget(uuid: string, node: Node){
    //     this._targetNodes.set(uuid, node);
    // }
    // getTarget(uuid: string){
    //     if(!uuid){
    //         return null;
    //     }

    //     let node = this._targetNodes.get(uuid);
    //     if(!node){
    //         console.warn("getTarget null. uuid="+uuid);
    //     }
    //     return node;
    // }
    // getTargetByPath(node: Node, path: string){
    //     if(!path){
    //         return null;
    //     }
        
    //     return node.getChildByPath(path);
    // }

    // initAllTarget(root: Node, uuids: Array<string>){
    //     if(!root || uuids.length==0) return;

    //     //按广度优先算法遍历子节点
    //     let listParent = [root];
    //     while (uuids.length>0 && listParent.length>0) {
    //         let parent: Node = listParent.shift();
    //         let array = parent.children;
    //         for (let index = 0; index < array.length; index++) {
    //             const child: any = array[index];
    //             let fileId = child._prefab?.fileId;
    //             let handled = false;
    //             if(fileId){
    //                 for (let i=uuids.length-1; i>=0; i--){
    //                     let uuid = uuids[i];
    //                     if(uuid.indexOf(fileId)>=0){
    //                         this.setTarget(uuid, child);
    //                         uuids.splice(i, 1);
    //                         handled = true;
    //                         break;
    //                     }
    //                 }
    //             }
    //             else{
    //                 let i = uuids.indexOf(child.uuid);
    //                 if(i>=0){
    //                     this.setTarget(child.uuid, child);
    //                     uuids.splice(i, 1);
    //                     handled = true;
    //                 }
    //             }

    //             if(!handled){
    //                 listParent.push(child);
    //             }
    //         }
    //     }
    //     //当前场景中找不到某些uuid引用的node节点（可能是行为树json数据中引用的节点被删除了）
    //     if(uuids.length>0){
    //         logger.warn("Unable to find reference node by uuids: ", uuids.join(","))
    //     }
    // }

    // /**
    //  * 按广度优先算法遍历子节点
    //  * @param uuid string
    //  * @returns 
    //  */
    //  searchTargetByUUID(root: Node, uuid: string) {
    //     if(!uuid || !root) return null;

    //     let node: Node = root.uuid==uuid ? root : null;
    //     if(node){
    //         return node;
    //     }

    //     //按广度优先算法遍历子节点
    //     let listParent = [root];
    //     while (!node && listParent.length>0) {
    //         let parent: Node = listParent.shift();
    //         let array = parent.children;
    //         for (let index = 0; index < array.length; index++) {
    //             const child = array[index];
    //             if(child.uuid == uuid){
    //                 node = child;
    //                 break;
    //             }
    //             else{
    //                 listParent.push(child);
    //             }
    //         }
    //     }
    //     return node;
    // }
}

