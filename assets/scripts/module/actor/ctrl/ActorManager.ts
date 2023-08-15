import { Component, Prefab, _decorator, instantiate, Node, resources, error } from "cc";
import { Entity } from "../entity/component/Entity";
import { ActorModel } from "../model/ActorModel";
import { EntityWeapon } from "../entity/component/EntityWeapon";

const { ccclass, property } = _decorator

@ccclass("ActorManager")
export class ActorManager extends Component {

    @property(Node)
    layer: Node = null;

    @property(Prefab)
    rolePrefab: Prefab = null;

    public model: ActorModel = null;

    protected onLoad(): void {
        this.model = new ActorModel();
    }

    public createRole() {
        let roleNode = instantiate(this.rolePrefab);
        let roleId = this.model.generateId()
        let role = roleNode.getComponent(Entity);
        role.entityId = roleId;
        role.name = "Role_" + roleId;
        role.node.setParent(this.layer);
        this.model.role = role;

        resources.load("prefab/weapons/RoleWeapon", Prefab, (err, asset) => {
            if (err) {
                error(err);
                return;
            }
            let weaponNode = instantiate(asset);
            let weapon = weaponNode.getComponent(EntityWeapon);
            this.model.role.setWeapon(weapon, 20);
        });
    }

    protected start(): void {
        this.createRole();
    }
}