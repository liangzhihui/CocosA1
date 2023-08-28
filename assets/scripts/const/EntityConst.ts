import { Enum } from "cc";

export enum EntityForward {
    Left = 1,
    Right,
}

Enum(EntityForward);

export enum EntitySide {
    None,
    Our,
    Enemy
}
Enum(EntitySide);