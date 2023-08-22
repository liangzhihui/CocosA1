import { Component, _decorator, Node } from "cc";
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

        let gameControl = new Node("GameControl");
        let inputManager = gameControl.addComponent(InputManager);

        let actorManager = gameControl.addComponent(ActorManager);
        actorManager.rolePrefab = this.element.rolePrefab;
        actorManager.actorLayer = this.element.actorLayer;
        actorManager.sceneLayer = this.element.sceneLayer;

        gameControl.setParent(this.node);

        A1.input = inputManager.inputState;
        A1.actorManager = actorManager;
    }
}