import { Component, EventKeyboard, Input, Vec2, _decorator, input } from "cc";
import { InputState } from "./InputState";
const { ccclass, property } = _decorator;

@ccclass("InputManager")
export class InputManager extends Component {
    private _inputState: InputState;

    public get inputState(): InputState {
        return this._inputState;
    }

    protected onLoad(): void {
        this._inputState = new InputState();

        input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this._onKeyUp, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this._onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this._onKeyUp, this);
    }

    private _onKeyDown(evt: EventKeyboard) {
        this._inputState.keyDown(evt.keyCode);
    }

    private _onKeyUp(evt: EventKeyboard) {
        this._inputState.keyUp(evt.keyCode);
    }
}