import { EventTarget } from "cc";
import { AnyFunction, IBehaviorEventListener, TBehaviorEventInterface } from "./behavior-event-declaration";

type CallbackList = any;

export class BehaviorEventTarget<T extends TBehaviorEventInterface> implements IBehaviorEventListener<T> {
	protected eventTarget = new EventTarget();

	on<Key extends keyof T>(key: Key, callback: T[Key], target?: unknown, once?: boolean): AnyFunction{
        return this.eventTarget.on(`${key}`, callback, target, once);
	}
	once<Key extends keyof T>(key: Key, callback: T[Key], target?: unknown): AnyFunction {
		return this.eventTarget.once(`${key}`, callback, target);
	}
	off<Key extends keyof T> (key: Key, callback?: AnyFunction, target?: any): void {
		this.eventTarget.off(`${key}`, callback, target);
	}
	targetOff (typeOrTarget: any): void {
		this.eventTarget.targetOff(typeOrTarget);
	}

	emit<Key extends keyof T>(key: Key, ...params: Parameters<T[Key]>): ReturnType<T[Key]>{
		//@ts-ignore
		const list: CallbackList = this.eventTarget._callbackTable && this.eventTarget._callbackTable[key]!;
		let arg0 = params[0];
		let arg1 = params[1];
        if (list) {
            const rootInvoker = !list.isInvoking;
            list.isInvoking = true;

            const infos = list.callbackInfos;
            for (let i = 0, len = infos.length; i < len; ++i) {
                const info = infos[i];
                if (info) {
                    const callback = info.callback;
                    const target = info.target;
                    // Pre off once callbacks to avoid influence on logic in callback
                    if (info.once) {
                        this.eventTarget.off(`${key}`, callback, target);
                    }
                    // Lazy check validity of callback target,
                    // if target is CCObject and is no longer valid, then remove the callback info directly
                    if (!info.check()) {
                        this.eventTarget.off(`${key}`, callback, target);
                    } else if (target) {
						let result = callback.call(target, arg0, arg1);
						if(typeof arg1 != "undefined"){
							arg1 = result;
						}                       
                    } else {
                        let result = callback(arg0, arg1);
						if(typeof arg1 != "undefined"){
							arg1 = result;
						}
                    }
                }
            }

            if (rootInvoker) {
                list.isInvoking = false;
                if (list.containCanceled) {
                    list.purgeCanceled();
                }
            }
        }
		return arg1 as ReturnType<T[Key]>;
	}
}