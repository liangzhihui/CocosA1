import { Constructor } from "cc";
import { resources } from "cc";
import { Asset } from "cc";
import { _decorator, Component } from "cc";
import { promisify } from "../../utils/promiseUtil";
const { ccclass } = _decorator;

type RequestItem = any;
const resources_aload = promisify(resources.load);
@ccclass("ResManager")
export class ResManager extends Component {

    load<T extends Asset>(paths: string, type: Constructor<T> | null, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: T) => void) | null): void;
    load<T extends Asset>(paths: string[], type: Constructor<T> | null, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: T[]) => void) | null): void;
    load<T extends Asset>(paths: string, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: T) => void) | null): void;
    load<T extends Asset>(paths: string[], onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: T[]) => void) | null): void;
    load<T extends Asset>(paths: string, onComplete?: ((err: Error | null, data: T) => void) | null): void;
    load<T extends Asset>(paths: string[], onComplete?: ((err: Error | null, data: T[]) => void) | null): void;
    load<T extends Asset>(paths: string, type: Constructor<T> | null, onComplete?: ((err: Error | null, data: T) => void) | null): void;
    load<T extends Asset>(paths: string[], type: Constructor<T> | null, onComplete?: ((err: Error | null, data: T[]) => void) | null): void;
    load() {
        resources.load.apply(resources, arguments);
    }

    aload<T extends Asset>(paths: string, type: Constructor<T> | null, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null): Promise<T>;
    aload<T extends Asset>(paths: string[], type: Constructor<T> | null, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null): Promise<T[]>;
    aload<T extends Asset>(paths: string, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null): Promise<T>;
    aload<T extends Asset>(paths: string[], onProgress: ((finished: number, total: number, item: RequestItem) => void) | null): Promise<T[]>;
    aload<T extends Asset>(paths: string): Promise<T>;
    aload<T extends Asset>(paths: string[]): Promise<T[]>;
    aload<T extends Asset>(paths: string, type: Constructor<T> | null): Promise<T>;
    aload<T extends Asset>(paths: string[], type: Constructor<T> | null): Promise<T[]>;
    aload(): any {
        return resources_aload.apply(resources, arguments);
    }
}