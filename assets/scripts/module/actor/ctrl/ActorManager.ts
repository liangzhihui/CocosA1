import { Component, Prefab, _decorator, instantiate, Node, resources, error, Collider2D } from "cc";
import { Entity } from "../entity/component/Entity";
import { ActorModel } from "../model/ActorModel";
import { EntityWeapon } from "../entity/component/EntityWeapon";
import { PolygonCollider2D } from "cc";
import { PhysicGroupIndex } from "../../../const/PhysicGroupIndex";
import { removeFromParent } from "../../../utils/ccUtil";
import { EntityBornData } from "../entity/EntityBornData";

const { ccclass, property } = _decorator
const ActorResPrefix = "prefab/actors/";
const WeaponResPrefix = "prefab/weapons/";

@ccclass("ActorManager")
export class ActorManager extends Component {

    @property(Node)
    actorLayer: Node = null;

    @property(Node)
    sceneLayer: Node = null;

    @property(Prefab)
    rolePrefab: Prefab = null;

    public model: ActorModel = null;

    protected onLoad(): void {
        this.model = new ActorModel();
        this.initSceneObstacles();
    }

    public initSceneObstacles() {
        let colliders = this.sceneLayer.getComponentsInChildren(PolygonCollider2D)
        let obstacles = this.model.obstacles;
        colliders.forEach(collider => {
            if (collider.group == PhysicGroupIndex.SceneObstacle) {
                obstacles.push(collider.node);
            }
        });
    }

    public createActor(bornData: EntityBornData) {
        let arr: Promise<Prefab>[] = [];
        let actorResUrl = ActorResPrefix + bornData.actorResUrl;
        arr.push(A1.resManager.aload(actorResUrl));

        let weaponResUrl = WeaponResPrefix + bornData.weaponResUrl;
        if (weaponResUrl) {
            arr.push(A1.resManager.aload(weaponResUrl));
        }

        Promise.all(arr).then(([actorPrefab, weaponPrefab]) => {
            let roleNode = instantiate(actorPrefab);
            let roleId = this.model.generateId()
            let role = roleNode.getComponent(Entity);
            role.entityId = roleId;
            role.name = "Role_" + roleId;
            role.side = bornData.side;
            role.attr.hp = bornData.hp;
            role.forward = bornData.forward;
            role.node.setPosition(bornData.pos.x, bornData.pos.y);
            role.node.setParent(this.actorLayer);
            this.model.role = role;

            if (weaponPrefab) {
                let weaponNode = instantiate(weaponPrefab);
                this.actorLayer.addChild(weaponNode);

                let weapon = weaponNode.getComponent(EntityWeapon);
                this.model.role.setWeapon(weapon, 20);
            }
        });
    }

    public getWeaponOwer(collider: Collider2D) {
        let weapon = this.model.role.weapon;
        if (weapon && weapon.collider == collider)
            return this.model.role;

        return this.model.actors.find(actor => {
            let weapon = actor.weapon;
            if (weapon && weapon.collider == collider)
                return actor;
        });
    }

    public removeAllActors() {
        let model = this.model;
        model.actors.forEach(actor => {
            let weapon: EntityWeapon;
            if (weapon = actor.weapon) {
                actor.weapon = null;
                removeFromParent(weapon.node, true);
            }
            removeFromParent(actor.node, true);
        });
        model.actors = [];

        let role = this.model.role
        let weapon: EntityWeapon;
        if (weapon = role.weapon) {
            role.weapon = null;
            removeFromParent(weapon.node, true);
        }
        removeFromParent(role.node, true);
        this.model.role = null;
    }
}