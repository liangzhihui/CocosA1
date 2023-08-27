import { _decorator, Camera, Component, Node, Prefab } from 'cc';
import { MainUI } from '../module/main/MainUI';
const { ccclass, property } = _decorator;

@ccclass('GameElement')
export class GameElement extends Component {

    @property(Camera)
    public sceneCamera: Camera = null;

    @property(Node)
    public sceneLayer: Node = null;

    @property(Node)
    public actorLayer: Node = null;

    @property(Prefab)
    public rolePrefab: Prefab = null;

    @property(MainUI)
    public mainui: MainUI = null;
}

