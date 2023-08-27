import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HpView')
export class HpView extends Component {

    @property
    private _value: number = 0;
    @property({ slide: true, step: 1, min: 0, max: 5 })
    public get hp() { return this._value; }
    public set hp(value) {
        this._value = value;
        this.updateHp();
    }

    @property([Node])
    hpNodes: Node[] = [];

    start() {
        this.updateHp();
    }

    updateHp() {
        let i = 0;
        let len = Math.min(this._value, this.hpNodes.length)
        for (; i < len; i++) {
            this.hpNodes[i].active = true;
        }

        len = this.hpNodes.length
        for (; i < len; i++) {
            this.hpNodes[i].active = false;
        }
    }
}

