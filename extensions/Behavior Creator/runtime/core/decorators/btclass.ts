/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module decorator
 */

import { CCClass, Enum, js, Node } from 'cc';
import { DEV, EDITOR } from 'cc/env';
import { BehaviorComposite } from '../behavior/behavior-composite';
import { BehaviorConditional } from '../behavior/behavior-conditional';
import { BehaviorDecorator } from '../behavior/behavior-decorator';
import { CloneEventOption, TArrayDelegateEvents, TBehaviorEventOption } from '../behavior/behavior-event-declaration';
import { BehaviorParallel } from '../behavior/behavior-parallel';
import { BehaviorSelector } from '../behavior/behavior-selector';
import { BehaviorSequence } from '../behavior/behavior-sequence';
import { BehaviorService } from '../behavior/behavior-service';
import { BehaviorTask } from '../behavior/behavior-task';
import { SharedVariable, SharedDynamic } from '../blackboard/shared-variable';
import { doValidateMethodWithProps_DEV } from './preprocess-class';
import { CACHE_KEY, emptyDecoratorFn, getClassCache, getSubDict, makeEditorClassDecoratorFn, makeSmartClassDecorator } from './tools';

//@ts-ignore
const legacyCC = window.cc;

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
export const ccclass: ((name?: string) => ClassDecorator) & ClassDecorator = makeSmartClassDecorator<string>((constructor, name) => {
    let base = js.getSuper(constructor);
    // console.log("base: ---------> ", constructor.name, base.name);
    if (base === Object) {
        base = null;
    }

    const proto = {
        name,
        extends: base,
        ctor: constructor,
    };

    let properties: any = {};
    let options: any = {};

    const cache = constructor[CACHE_KEY];
    if (cache) {
        const decoratedProto = cache.proto;
        if (decoratedProto) {
            if(EDITOR){
                options = getSubDict(decoratedProto, 'options');
                
                properties = getSubDict(decoratedProto, 'properties');
                for (const key in properties) {
                    let value = properties[key];
                    if(value.type){
                        let tooltip: string = value.tooltip;
                        if(tooltip){
                            let pos1 = tooltip.indexOf("{{");
                            let pos2 = tooltip.indexOf("}}");
                            if(pos1>=0&&pos2>0&&pos2>pos1){
                                let match = tooltip.substring(pos1, pos2+2);
                                let baseon = tooltip.substring(pos1+2, pos2)
                                value.tooltip = tooltip.replace(match, baseon);
                                value.BASEON = baseon;
                            }
                        }
                        
                        if(js.isChildClassOf(value.type, Node)){
                            delete value.type;
                            value.TYPE = "cc.Node";
                            value.path = "";
                        }
                        else if(js.isChildClassOf(value.type, SharedVariable)){
                            value.TYPE = `bt.${value.type.name}`;
                            delete value.type;
                        }
                        else if(js.isChildClassOf(value.type, SharedDynamic)){
                            value.TYPE = `bt.SharedDynamic`;
                            delete value.type;
                        }
                        else if(typeof value.type == 'object'){
                            if(Enum.isEnum(value.type)){
                                value.TYPE = `cc.Enum`;
                                value.enum = value.type;
                            }
                            else{
                                console.warn(`[oreo-behavior-tree] unsupported property: key=${key} type=`, value.type);
                            }
                            delete value.type;
                        }
                        else if(typeof value.type == 'function'){
                            console.error(`[oreo-behavior-tree] unsupported property: key=${key} type=`, value.type);
                        }
                    }
                }
            }

            // decoratedProto.properties = createProperties(ctor, decoratedProto.properties);
            js.mixin(proto, decoratedProto);
        }
        constructor[CACHE_KEY] = undefined;
    }

    const res = CCClass(proto);

    // validate methods
    if (DEV) {
        const propNames = Object.getOwnPropertyNames(constructor.prototype);
        for (let i = 0; i < propNames.length; ++i) {
            const prop = propNames[i];
            if (prop !== 'constructor') {
                const desc = Object.getOwnPropertyDescriptor(constructor.prototype, prop);
                const func = desc && desc.value;
                if (typeof func === 'function') {
                    doValidateMethodWithProps_DEV(func, prop, js.getClassName(constructor), constructor, base);
                }
            }
        }
    }

    const frame = legacyCC._RF.peek();
    if(!frame || frame.cls != constructor){
        console.warn("invalid btclass: ", constructor.name);
        return;
    }

    js._setClassId(frame.uuid, res);

    if(EDITOR){
        let events: {[key: string]: TBehaviorEventOption} = {};
        if(options.events instanceof Array){
            options.events.forEach(event => {
                events[event] = CloneEventOption();
            });
        }

        let info = {
            group: '',
            type: '',
            name: js.getClassName(constructor),
            uuid: frame.uuid,
            properties,
            events: events,
        };
        if(js.isChildClassOf(constructor, BehaviorService)){
            info.type = 'service';
        }
        else if(js.isChildClassOf(constructor, BehaviorTask)){
            info.type = 'task';
        }
        else if(js.isChildClassOf(constructor, BehaviorDecorator)){
            info.group = 'decorator';
            info.type = 'decorator';
            if(js.isChildClassOf(constructor, BehaviorConditional)){
                info.type = 'condition';
            }
        }
        else if(js.isChildClassOf(constructor, BehaviorComposite)){
            info.group = 'composite';
            info.type = 'composite';
            if(js.isChildClassOf(constructor, BehaviorSelector)){
                info.type = 'selector';
            }
            else if(js.isChildClassOf(constructor, BehaviorSequence)){
                info.type = 'sequence';
            }
            else if(js.isChildClassOf(constructor, BehaviorParallel)){
                info.type = 'parallel';
            }
        }
        if(!info.group){
            info.group = info.type;
        }

        
        // console.log("btclass-registered", info);
        Editor.Message.broadcast("btclass-registered", info);
        // Editor.Message.send("oreo-behavior-creator", "btclass-registered", info);

        // //@ts-ignore
        // EditorExtends.emit('btclass-registered');
    }

    return res;
});

/**
 * @zh 向编辑器注册生命周期委托。例如 @delegate(['onUpdate', 'onEnable'])。
 * @param events: TArrayDelegateEvents
 * @example
 * @bt.ccclass
 * @bt.delegate(['onUpdate', 'onEnable'])
 * class NewTask extends bt.Task {
 *     // ...
 * }
 */
export const delegate: (events: TArrayDelegateEvents) => ClassDecorator =  EDITOR ? makeEditorClassDecoratorFn('events') : emptyDecoratorFn;
