import { AnimationComponent } from "cc";
import { _decorator, Component, Node, animation } from "cc";
const { ccclass, property } = _decorator;

const EventType = {
    kill: 'kill'
}

@ccclass("ActorAnimationGraphComponent")
export class ActorAnimationGraphComponent extends animation.StateMachineComponent {

    public static EventType = EventType;

    @property
    public animationName: string = "";
    @property
    public isDead: boolean = false;

    private killed: boolean = false;
    private animation: AnimationComponent = null;
    private initAnimation(controller: animation.AnimationController) {
        if (!this.animation) {
            this.animation = controller.getComponentInChildren(AnimationComponent);
        }
    }
    /**
     * Called right after a motion state is entered.
     * @param controller The animation controller it within.
     * @param motionStateStatus The status of the motion.
     */
    public onMotionStateEnter(controller: animation.AnimationController, motionStateStatus: Readonly<animation.MotionStateStatus>): void {
        this.initAnimation(controller);
        if (this.animation && this.animationName)
            this.animation.play(this.animationName);
    }

    public onMotionStateUpdate(controller: animation.AnimationController, motionStateStatus: Readonly<animation.MotionStateStatus>): void {
        if (this.isDead) {
            if (this.killed)
                return;
            let state = this.animation && this.animation.getState(this.animationName);
            if (state && state.isPlaying)
                return;
            this.killed = true;
            controller.node.emit(EventType.kill);
        }
    }
}
