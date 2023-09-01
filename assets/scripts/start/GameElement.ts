import { _decorator, Component, Node } from 'cc';
import { MainUI } from '../module/main/MainUI';
import { CameraController } from '../module/camera/CameraController';
import { Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameElement')
export class GameElement extends Component {

    @property(CameraController)
    public sceneCamera: CameraController = null;

    @property(Node)
    public sceneLayer: Node = null;

    @property(Node)
    public actorLayer: Node = null;

    @property(Node)
    public bulletLayer: Node = null;

    @property(Prefab)
    public bulletPrefab: Prefab = null;

    @property(MainUI)
    public mainui: MainUI = null;
}

