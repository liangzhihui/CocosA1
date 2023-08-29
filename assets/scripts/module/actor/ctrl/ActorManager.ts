import { Component, Prefab, _decorator, instantiate, Node, resources, error, Collider2D } from "cc";
import { Entity } from "../entity/component/Entity";
import { ActorModel } from "../model/ActorModel";
import { EntityWeapon } from "../entity/component/EntityWeapon";
import { PolygonCollider2D } from "cc";
import { PhysicGroupIndex } from "../../../const/PhysicGroupIndex";
import { removeFromParent } from "../../../utils/ccUtil";
import { EntityBornData } from "../entity/EntityBornData";
import { EntitySide } from "../../../const/EntityConst";

const { ccclass, property } = _decorator
const ActorResPrefix = "prefab/actors/";
const WeaponResPrefix = "prefab/weapons/";

const EventType = {
    addActor: "AddActor",
    removeActor: "removeActor"
}

@ccclass("ActorManager")
export class ActorManager extends Component {
    public static EventType = EventType;

    @property(Node)
    public actorLayer: Node = null;

    @property(Node)
    public sceneLayer: Node = null;

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
            let actorNode = instantiate(actorPrefab);
            let actorId = this.model.generateId()
            let actor = actorNode.getComponent(Entity);
            actor.entityId = actorId;
            actor.name = "Actor_" + actorId;
            actor.side = bornData.side;
            actor.attr.hp = bornData.hp;
            actor.forward = bornData.forward;
            if (actor.side == EntitySide.Our && !this.model.role) {
                actor.isRole = true;
                this.model.role = actor;
            }
            else {
                actor.isRole = false;
                this.model.actors[actorId] = actor;
            }

            actor.node.setPosition(bornData.pos.x, bornData.pos.y);
            actor.node.setParent(this.actorLayer);

            if (weaponPrefab) {
                let weaponNode = instantiate(weaponPrefab);
                this.actorLayer.addChild(weaponNode);

                let weapon = weaponNode.getComponent(EntityWeapon);
                actor.setWeapon(weapon, 20);
            }

            this.node.emit(EventType.addActor, actor);
        });
    }

    public removeActor(entityId: number) {
        let role = this.model.role
        if (role && role.entityId == entityId) {
            removeFromParent(role.node, true);
            this.model.role = null;
        }
        else {
            let actors = this.model.actors;
            let actor = actors[entityId];
            if (actor) {
                removeFromParent(actor.node, true);
                actors[entityId] = null;
            }
        }
    }

    public removeAllActors() {
        let model = this.model;
        let actors = model.actors;
        let actor: Entity;
        let weapon: EntityWeapon;
        for (let entityId in actors) {
            actor = actors[entityId];

            if (weapon = actor.weapon) {
                actor.weapon = null;
                removeFromParent(weapon.node, true);
            }
            removeFromParent(actor.node, true);
        }
        model.actors = Object.create(null);

        let role = this.model.role
        if (weapon = role.weapon) {
            role.weapon = null;
            removeFromParent(weapon.node, true);
        }
        removeFromParent(role.node, true);
        this.model.role = null;
    }

    public getWeaponOwer(collider: Collider2D) {
        let weapon: EntityWeapon;
        weapon = this.model.role.weapon;
        if (weapon && weapon.collider == collider)
            return this.model.role;

        let actors = this.model.actors;
        let actor: Entity;
        for (let entityId in actors) {
            actor = actors[entityId];
            weapon = actor.weapon;
            if (weapon && weapon.collider == collider)
                return actor;
        }
    }

}