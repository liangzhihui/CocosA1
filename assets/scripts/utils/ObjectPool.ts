import { Constructor, _decorator, js } from "cc";

const { ccclass } = _decorator;

@ccclass("ObjectPool")
export class ObjectPool {

    private static _content: {[className: string]: any[]} = {};

    public static pop<T>(clazz: Constructor<T>, ...args: any[]): T {
        let name = js.getClassName(clazz);

        if (!this._content[name])
            this._content[name] = [];

        let cache: Array<T> = this._content[name];
        if (cache.length)
            return cache.pop();

        let obj: T = new clazz(...args);
        obj['__objectPoolKey'] = name;
        return obj;
    }

    public static push<T>(obj: T): boolean {
        if (obj == null)
            return false;

        let className = obj['__objectPoolKey'];
        if (!className ||
            !this._content[className] ||
            this._content[className].indexOf(obj) >= 0) {
            return false;
        }

        this._content[className].push(obj);
        return true;
    }

    public static clear(): void {
        this._content = {};
    }
}