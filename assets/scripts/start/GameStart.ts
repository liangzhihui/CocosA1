import { Component, _decorator } from "cc";
const { ccclass, property } = _decorator;
import "../base";
import { InputManager } from "../input/InputManager";
import { ActorManager } from "../module/actor/ctrl/ActorManager";
import { GameElement } from "./GameElement";

@ccclass("GameStart")
export class GameStart extends Component {

    @property(GameElement)
    element: GameElement = null;

    onLoad() {
        A1.element = this.element;

        let inputManager = this.addComponent(InputManager);
        A1.input = inputManager.inputState;

        let actorManager = this.addComponent(ActorManager);
        actorManager.rolePrefab = this.element.rolePrefab;
        actorManager.layer = this.element.actorLayer;
        A1.actorManager = actorManager;
    }
}