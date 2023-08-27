import { Node } from 'cc';

export function removeFromParent(node: Node, cleanup?: boolean) {
    node.removeFromParent();
    if (cleanup) {
        node.destroy();
    }
}