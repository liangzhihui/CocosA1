import { view } from 'cc';
import { _decorator, Component, Node, Vec3, UITransform, clamp, Vec2, Camera } from 'cc';
const { ccclass, property } = _decorator;

const v3 = new Vec3();

@ccclass('CameraController')
export class CameraController extends Component {

    @property
    public speed: number = 10;
    public target: Node = null;

    private _camera: Camera;
    private _pos: Vec3 = new Vec3();
    private _xrange: Vec2 = new Vec2(-Infinity, +Infinity);
    protected onLoad(): void {
        this.node.getPosition(this._pos);
        this._camera = this.node.getComponent(Camera);
        this._camera.orthoHeight = view.getVisibleSize().height / 2;
    }

    protected start(): void {
        let level = A1.level;
        if (level) {
            let rect = level.getRect();
            let width2 = view.getVisibleSize().width / 2;
            this._xrange.x = rect.xMin + width2;
            this._xrange.y = rect.xMax - width2;
        }
    }

    setTarget(target: Node) {
        this.target = target;
        if (target) {
            target.getPosition(v3);
            this._pos.x = clamp(v3.x, this._xrange.x, this._xrange.y);
            this.node.setPosition(this._pos);
        }
    }

    update(deltaTime: number) {
        if (this.target) {
            this.target.getPosition(v3);
            this._pos.x = clamp(v3.x, this._xrange.x, this._xrange.y);
            this.node.getPosition(v3);
            Vec3.lerp(v3, v3, this._pos, this.speed * deltaTime);
            this.node.setPosition(v3);
        }
    }
}

