import { _decorator, Component, Node } from 'cc';
import { EntityAttribute } from '../actor/entity/EntityAttribute';
import { Entity } from '../actor/entity/component/Entity';
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

    private _role: Entity;

    onEnable(): void {
        let role = this.getRole();
        this._role = role;
        if (role) {
            role.attr.on(EntityAttribute.EventType.hpChanged, this._onHpChanged, this);
            this.hp = role.attr.hp;
        }
    }

    onDisable(): void {
        let role: Entity;    
        if (role = this._role) {
            role.attr.off(EntityAttribute.EventType.hpChanged, this._onHpChanged, this);
        }
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

    getRole() {
        let model = A1.actorManager.model;
        let role = model.role;
        return role;
    }

    private _onHpChanged() {
        let role: Entity;    
        if (role = this._role) {
            this.hp = role.attr.hp;
        }
    }
}

