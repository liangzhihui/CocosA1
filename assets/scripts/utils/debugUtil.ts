import { DEBUG } from "cc/env";
import { log as cclog, warn as ccwarn, error as ccerror } from "cc";

var trace_log: Function = function () { cclog.apply(null, arguments); }

export function log(message: any, ...args: any[]): void {
    if (DEBUG) {
        trace_log(message, ...args);
    }
}

export function warn(message: any, ...args: any[]): void {
    ccwarn(message, ...args);
}

export function error(message: any, ...args: any[]): void {
    ccerror(message, ...args);
}

export function assert(condition: any, message?: string) {
    if (DEBUG) {
        if (!condition) {
            throw new Error(message || "Assertion failed");
        }
    }
}

export function tap(value: any, fn = x => x) {
    log(fn(value))
    return value;
}
