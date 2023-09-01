import { Vec2 } from "cc";
import { Bullet } from "./Bullet";

export interface IBulletObserver {
    update(bullet: Bullet, pos?: Vec2): void;
}