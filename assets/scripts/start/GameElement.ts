import { _decorator, Component, Node } from 'cc';
import { MainUI } from '../module/main/MainUI';
import { CameraController } from '../module/camera/CameraController';
const { ccclass, property } = _decorator;

@ccclass('GameElement')
export class GameElement extends Component {

    @property(CameraController)
    public sceneCamera: CameraController = null;

    @property(Node)
    public sceneLayer: Node = null;

    @property(Node)
    public actorLayer: Node = null;

    @property(MainUI)
    public mainui: MainUI = null;
}

