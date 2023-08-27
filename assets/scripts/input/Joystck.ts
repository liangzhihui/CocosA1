import { _decorator, Component, EventTouch, math, Node, NodeEventType, UITransform, Vec2, Vec3 } from 'cc';
import { limit, rotationBetween, setLength } from '../utils/vec2Util';
const { ccclass, property, type } = _decorator;

const v2 = new Vec2();
const v3 = new Vec3();

@ccclass('Joystck')
export class Joystck extends Component {

    @type(Node)
    public touchNode: Node = null;

    @type(Node)
    public backgroundNode: Node = null;

    @type(Node)
    public directionNode: Node = null;

    @type(Node)
    public arrowNode: Node = null;

    @property
    public threshold: number = 0.1;

    @property({ readonly: true })
    public dir: Vec2 = new Vec2(0, 0)

    private _transform: UITransform;
    private _range: number;

    protected onLoad(): void {
        this.dir.set(0, 0);
        this.backgroundNode.active = false;
        this._transform = this.getComponent(UITransform);
        this._range = (this.backgroundNode.getComponent(UITransform).width - this.directionNode.getComponent(UITransform).width) >> 1;

        this.touchNode.on(NodeEventType.TOUCH_START, this._onTouchStart, this);
        this.touchNode.on(NodeEventType.TOUCH_CANCEL, this._onTouchCancel, this);
        this.touchNode.on(NodeEventType.TOUCH_MOVE, this._onTouchMove, this);
        this.touchNode.on(NodeEventType.TOUCH_END, this._onTouchEnd, this);
    }

    protected onDisable(): void {
        this._onTouchEnd(null);
    }

    private _onTouchStart(evt: EventTouch) {
        this._setDir(Vec2.ZERO);
        evt.getUILocation(v2);
        v3.set(v2.x, v2.y, 0);
        this._transform.convertToNodeSpaceAR(v3, v3)
        this.backgroundNode.active = true;
        this.backgroundNode.setPosition(v3);
    }

    private _onTouchCancel(evt: EventTouch) {
        this._onTouchEnd(evt);
    }

    private _onTouchMove(evt: EventTouch) {
        let startPt = evt.getUIStartLocation();
        let pt = evt.getUILocation();

        Vec2.subtract(v2, pt, startPt);
        limit(v2, v2, this._range);
        this._updateDirectionNode(v2);

        if (Math.abs(v2.x) + Math.abs(v2.y) < this.threshold) {
            this._setDir(Vec2.ZERO);
            return;
        }

        this._setDir(v2.normalize());
    }

    private _onTouchEnd(evt: EventTouch) {
        this._setDir(Vec2.ZERO);
        this.backgroundNode.active = false;
        this.backgroundNode.setPosition(Vec3.ZERO);
        this._updateDirectionNode(Vec2.ZERO);
    }

    public setVisible(value: boolean) {
        this.backgroundNode.active = value;
    }

    public setDir(value: Vec2) {
        this._setDir(value.normalize());

        setLength(v2, this.dir, this._range);
        this._updateDirectionNode(v2);
    }

    private _setDir(value: Vec2) {
        this.dir.set(value)
        let input = A1.input;
        if (input) {
            input.setAxis('Vertical', value.y);
            input.setAxis('Horizontal', value.x);
        }
    }
    
    private _updateDirectionNode(vec: Vec2) {
        this.directionNode.setPosition(vec.x, vec.y, 0);

        if (vec.x == 0 && vec.y == 0) {
            this.arrowNode.active = false;
            this.directionNode.setRotationFromEuler(0, 0, 0);
            return
        }

        this.arrowNode.active = true;
        let rad = rotationBetween(Vec2.UNIT_Y, vec);
        this.directionNode.setRotationFromEuler(0, 0, math.toDegree(rad));
    }
}

