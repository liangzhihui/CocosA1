import { _decorator, Camera, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameElement')
export class GameElement extends Component {

    @property(Camera)
    public sceneCamera: Camera = null;

    @property(Node)
    public actorLayer: Node = null;

    @property(Prefab)
    public rolePrefab: Prefab = null;
}

