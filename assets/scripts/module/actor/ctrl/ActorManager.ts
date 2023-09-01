import { Component, Prefab, _decorator, instantiate, Node, resources, error, Collider2D } from "cc";
import { Entity } from "../entity/component/Entity";
import { ActorModel } from "../model/ActorModel";
import { EntityWeapon } from "../entity/component/EntityWeapon";
import { PolygonCollider2D } from "cc";
import { PhysicGroupIndex } from "../../../const/PhysicGroupIndex";
import { removeFromParent } from "../../../utils/ccUtil";
import { EntityBornData } from "../entity/EntityBornData";
import { EntitySide } from "../../../const/EntityConst";
import { ProjectileBulletSystem } from "../../bullet/ProjectileBulletSystem";
import { Vec3 } from "cc";

const { ccclass, property } = _decorator
const ActorResPrefix = "prefab/actors/";
const WeaponResPrefix = "prefab/weapons/";
const v3 = new Vec3();

const EventType = {
    addActor: "AddActor",
    removeActor: "RemoveActor",
    removeAllActor: "RemoveAllActor"
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
        let actorResUrl = bornData.actorResUrl;
        arr.push(A1.resManager.aload(ActorResPrefix + actorResUrl));

        let weaponResUrl = bornData.weaponResUrl;
        if (weaponResUrl) {
            arr.push(A1.resManager.aload(WeaponResPrefix + weaponResUrl));
        }

        let actorId = this.model.generateId()

        if (this.model.role || bornData.side != EntitySide.Our) {
            this.model.actorCount++;
        }

        Promise.all(arr).then(([actorPrefab, weaponPrefab]) => {
            let actorNode = instantiate(actorPrefab);
            let actor = actorNode.getComponent(Entity);
            actor.entityId = actorId;
            actor.name = "Actor_" + actorId;
            actor.side = bornData.side;
            actor.sight = bornData.sight;
            actor.attr.hp = bornData.hp;
            actor.forward = bornData.forward;
            if (bornData.enableBullet) {
                let pbs = new ProjectileBulletSystem();
                pbs.setBulletEnergy(bornData.bullet.energy);
                pbs.setBulletSize(bornData.bullet.size);
                pbs.setBulletResUrl(bornData.bullet.resUrl);
                pbs.setTrajectory(bornData.bullet.trajectory);
                pbs.setTrajectorySpeed(bornData.bullet.speed);
                pbs.setTrajectoryAccel(bornData.bullet.accel);
                actor.projecttileBulletSystem = pbs
            }
            if (actor.side == EntitySide.Our && !this.model.role) {
                actor.isRole = true;
                this.model.role = actor;
            }
            else {
                actor.isRole = false;
                this.model.actors[actorId] = actor;
            }

            bornData.bornNode.getWorldPosition(v3);
            actor.node.setParent(this.actorLayer);
            actor.node.setWorldPosition(v3.x, v3.y, v3.z);

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
        this.node.emit(EventType.removeActor, entityId);

        let weapon: EntityWeapon;
        let role = this.model.role
        if (role && role.entityId == entityId) {
            if (weapon = role.weapon) {
                role.weapon = null;
                removeFromParent(weapon.node, true);
            }
            removeFromParent(role.node, true);
            this.model.role = null;
        }
        else {
            let actors = this.model.actors;
            let actor = actors[entityId];
            if (actor) {
                if (weapon = actor.weapon) {
                    actor.weapon = null;
                    removeFromParent(weapon.node, true);
                }
                removeFromParent(actor.node, true);
                delete actors[entityId];
                this.model.actorCount--;
            }
        }
    }

    public removeAllActors() {
        this.node.emit(EventType.removeAllActor);

        let model = this.model;
        let actors = model.actors;
        let actor: Entity;
        let weapon: EntityWeapon;
        for (let entityId in actors) {
            actor = actors[entityId];

            if (actor) {
                if (weapon = actor.weapon) {
                    actor.weapon = null;
                    removeFromParent(weapon.node, true);
                }
                removeFromParent(actor.node, true);
            }
        }
        model.actors = Object.create(null);
        model.actorCount = 0;

        let role = model.role
        if (!role)
            return;

        if (weapon = role.weapon) {
            role.weapon = null;
            removeFromParent(weapon.node, true);
        }
        removeFromParent(role.node, true);
        model.role = null;
        model.resetGenerateId();
    }

    public getActor(collider: Collider2D) {
        let role = this.model.role
        if (role && role.collider == collider)
            return role;

        let actors = this.model.actors;
        let actor: Entity;
        for (let entityId in actors) {
            actor = actors[entityId];
            if (actor && actor.collider == collider) {
                return actor;
            }
        }
    }

    public getWeaponOwer(collider: Collider2D) {
        let weapon: EntityWeapon;
        let role = this.model.role
        weapon = role && role.weapon;
        if (weapon && weapon.collider == collider)
            return role;

        let actors = this.model.actors;
        let actor: Entity;
        for (let entityId in actors) {
            actor = actors[entityId];
            if (actor) {
                weapon = actor.weapon;
                if (weapon && weapon.collider == collider)
                    return actor;
            }
        }
    }

}