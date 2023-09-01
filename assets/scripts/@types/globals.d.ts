declare namespace A1 {
    export let element: import("../start/GameElement").GameElement;
    export let input: import("../input/InputState").InputState;
    export let resManager: import("../module/res/ResManager").ResManager;
    export let actorManager: import("../module/actor/ctrl/ActorManager").ActorManager;
    export let bulletManager: import("../module/bullet/BulletManager").BulletManager;
    export let sceneCamera: import("../module/camera/CameraController").CameraController;
    export let mainui: import("../module/main/MainUI").MainUI;
    export let level: import("../module/level/Level").Level;
}