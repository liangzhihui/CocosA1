import { _decorator, Node } from "cc";
import { Entity } from "../entity/component/Entity";

const { ccclass } = _decorator

@ccclass("ActorModel")
export class ActorModel {

    public role: Entity = null;
    public actors: {[entityId: number]: Entity} = Object.create(null);
    public actorCount = 0;
    public obstacles: Node[] = [];

    private _nextId = 1;
    public generateId() {
        return this._nextId++;
    }
    public resetGenerateId() {
        this._nextId = 1;
    }

}