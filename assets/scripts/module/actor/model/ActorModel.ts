import { _decorator, Node } from "cc";
import { Entity } from "../entity/component/Entity";
import { EntityWeapon } from "../entity/component/EntityWeapon";

const { ccclass } = _decorator

@ccclass("ActorModel")
export class ActorModel {

    public role: Entity = null;
    public actors: {[entityId: number]: Entity} = Object.create(null);
    public obstacles: Node[] = [];

    private _nextId = 1;
    public generateId() {
        return this._nextId++;
    }


}