import { _decorator, Component, Node } from 'cc';
import { EntityAttribute } from '../actor/entity/EntityAttribute';
import { Entity } from '../actor/entity/component/Entity';
import { ActorManager } from '../actor/ctrl/ActorManager';
import { isValid } from 'cc';
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

    onLoad() {
        let actorManager = A1.actorManager;
        actorManager.node.on(ActorManager.EventType.addActor, this.onAddActor, this);
        actorManager.node.on(ActorManager.EventType.removeActor, this.onRemoveActor, this);
        actorManager.node.on(ActorManager.EventType.removeAllActor, this.onRemoveAllActor, this);
    }

    onDestroy(): void {
        let actorManager = A1.actorManager;
        if (isValid(actorManager)) {
            actorManager.node.off(ActorManager.EventType.addActor, this.onAddActor, this);
            actorManager.node.off(ActorManager.EventType.removeActor, this.onRemoveActor, this);
            actorManager.node.off(ActorManager.EventType.removeAllActor, this.onRemoveAllActor, this);
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

    private onAddActor(actor: Entity) {
        if (actor.isRole) {
            this.addRole();
        }
    }

    private onRemoveActor(entityId: number) {
        if (this._role && this._role.entityId == entityId) {
            this.removeRole();
        }
    }

    private onRemoveAllActor() {
        this.removeRole();
    }

    private addRole() {
        let role = this.getRole();
        this._role = role;
        if (role) {
            role.attr.on(EntityAttribute.EventType.hpChanged, this._onHpChanged, this);
            this.hp = role.attr.hp;
        }
    }

    private removeRole() {
        let role: Entity;    
        if (role = this._role) {
            role.attr.off(EntityAttribute.EventType.hpChanged, this._onHpChanged, this);
            this._role = null;
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

