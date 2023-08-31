import { _decorator, Node, Component } from "cc";
import { Entity } from "../actor/entity/component/Entity";
const { ccclass } = _decorator;

@ccclass("AIEnemy")
export class AIEnemy extends Component {

    public entity: Entity = null;
}