import { _decorator } from "cc";
import { Entity } from "../entity/component/Entity";

const { ccclass } = _decorator

@ccclass("ActorModel")
export class ActorModel {

    public role: Entity = null;

    private _nextId = 1;
    public generateId() {
        return this._nextId++;
    }
}