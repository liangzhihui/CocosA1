import { CCObject, Component, clamp, math } from "cc";

/** 在[l1, r1]范围内映射val值到[l2, r2]范围 */
export function rangeMap(val: number, l1: number, r1: number, l2: number, r2: number) {
    val = clamp(val, l1, r1);
    return (val - l1) / (r1 - l1) * (r2 - l2) + l2;
}

export function almostEqual(value1: number, value2: number, errorMargin = 0.0001) {
    if (Math.abs(value1 - value2) <= errorMargin) return true;
    else return false;
}

export let cosValues: number[] = [], sinValues: number[] = [];
for (let i = 0; i < 360; i++) {
    const r = math.toRadian(i);
    cosValues[i] = Math.cos(r);
    sinValues[i] = Math.sin(r);
}

export function getLocalDate(i: number, times: number) {
    //参数i为时区值数字，比如北京为东八区则输进8,纽约为西5区输入-5
    if (typeof i !== 'number') return;
    let d = new Date(times);
    let len = d.getTime();
    let offset = d.getTimezoneOffset() * 60000;
    let utcTime = len + offset;
    return new Date(utcTime + 3600000 * i);
}

export function setActive(target: any, active: true|false, hiddenKey: string = "default"): boolean
{
    let keys = target.__hiddenKey__;
    if (!keys)
        keys = target.__hiddenKey__  = new Object({size: 0});
    if (hiddenKey === "size")
        hiddenKey = "_size";
    let _active: boolean;
    if (active)
    {
        if (keys[hiddenKey])
        {
            delete keys[hiddenKey];
            keys.size = Math.max(0, keys.size-1);
        }
        _active = keys.size == 0;
    }
    else
    {
        if (!keys[hiddenKey])
        {
            keys[hiddenKey] = 'e';
            keys.size += 1;
        }
        _active = false;
    }
    target.active = _active;
    return _active;
}

export function getActive(target: any, hiddenKey: string = "default")
{
    let keys = target.__hiddenKey__;
    if (!keys)
        return true;
    return !keys[hiddenKey];
}

export function isStartCalled(comp: Component): boolean {
    const IsStartCalled = CCObject.Flags.IsStartCalled;
    return (comp._objFlags & IsStartCalled) == IsStartCalled;
}