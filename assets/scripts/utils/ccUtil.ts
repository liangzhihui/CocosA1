import { Vec2, Node, RigidBody2D } from 'cc';

export function removeFromParent(node: Node, cleanup?: boolean) {
    node.removeFromParent();
    if (cleanup) {
        node.destroy();
    }
}

export function setRigidBodyLinearVelocity(body: RigidBody2D, v: Vec2) {
    let velocity = body.linearVelocity;
    velocity.x = v.x;
    velocity.y = v.y;
    body.linearVelocity = velocity;
}