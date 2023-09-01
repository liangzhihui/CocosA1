import { Component, _decorator, Node } from "cc";
const { ccclass, property } = _decorator;
import "../base";
import { InputManager } from "../input/InputManager";
import { ActorManager } from "../module/actor/ctrl/ActorManager";
import { GameElement } from "./GameElement";
import { ResManager } from "../module/res/ResManager";
import { BulletManager } from "../module/bullet/BulletManager";

@ccclass("GameStart")
export class GameStart extends Component {

    @property(GameElement)
    element: GameElement = null;

    onLoad() {
        A1.element = this.element;

        let gameControl = new Node("GameControl");
        let inputManager = gameControl.addComponent(InputManager);

        let resManager = gameControl.addComponent(ResManager);

        let actorManager = gameControl.addComponent(ActorManager);
        actorManager.actorLayer = this.element.actorLayer;
        actorManager.sceneLayer = this.element.sceneLayer;

        let bulletManager = gameControl.addComponent(BulletManager);
        bulletManager.bulletLayer = this.element.bulletLayer;
        bulletManager.bulletPrefab = this.element.bulletPrefab;

        gameControl.setParent(this.node);

        A1.input = inputManager.inputState;
        A1.resManager = resManager;
        A1.actorManager = actorManager;
        A1.bulletManager = bulletManager;
        A1.sceneCamera = this.element.sceneCamera;
        A1.mainui = this.element.mainui;
    }
}