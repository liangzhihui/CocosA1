import { KeyCode, _decorator } from "cc";
import { ObjectPool } from "../utils/ObjectPool";

const { ccclass } = _decorator;

const w = KeyCode.KEY_W;
const s = KeyCode.KEY_S;
const a = KeyCode.KEY_A;
const d = KeyCode.KEY_D;
const up = KeyCode.ARROW_UP;
const down = KeyCode.ARROW_DOWN;
const left = KeyCode.ARROW_LEFT;
const right = KeyCode.ARROW_RIGHT;

const vertical = "Vertical";;
const horizontal = "Horizontal";

@ccclass("InputState")
export class InputState {
    keyboard: { [key: number]: InputKey } = {};
    axis: { [axisName: string]: number } = {};

    public keyDown(keyCode: number): void {
        let inputKey = this.keyboard[keyCode];
        if (!inputKey) {
            inputKey = this.keyboard[keyCode] = ObjectPool.pop(InputKey);
            inputKey.keyCode = keyCode;
        }

        let value = 1;
        switch (keyCode) {
            case w: case up:
                this.setAxis(vertical, value);
                break;
            case s: case down:
                this.setAxis(vertical, -value);
                break;
            case a: case left:
                this.setAxis(horizontal, -value);
                break;
            case d: case right:
                this.setAxis(horizontal, value);
                break;
        }
    }

    public keyUp(keyCode: number) {
        let inputKey = this.keyboard[keyCode];
        if (inputKey) {
            this.keyboard[keyCode] = null;
            inputKey.dispose();
            ObjectPool.push(inputKey);
        }

        switch (keyCode) {
            case w: case up:
                this._onVKeyUp();
                break;
            case s: case down:
                this._onVKeyUp();
                break;
            case a: case left:
                this._onHKeyUp();
                break;
            case d: case right:
                this._onHKeyUp();
                break;
        }
    }

    public getAxis(axisName: string) {
        if (this.axis[axisName] != null)
            return this.axis[axisName];
        return 0;
    }

    public setAxis(axisName: string, value: number) {
        this.axis[axisName] = value;
    }

    private _onVKeyUp() {
        let keyboard = this.keyboard;
        let key = keyboard[w] || keyboard[up] || keyboard[s] || keyboard[down];
        if (key) {
            let value = key.keyCode == w || key.keyCode == up ? 1 : -1;
            this.setAxis(vertical, value);
        } else {
            this.setAxis(vertical, 0);
        }
    }

    private _onHKeyUp() {
        let keyboard = this.keyboard;
        let key = keyboard[a] || keyboard[left] || keyboard[d] || keyboard[right];
        if (key) {
            let value = key.keyCode == a || key.keyCode == left ? -1 : 1;
            this.setAxis(horizontal, value);
        } else {
            this.setAxis(horizontal, 0);
        }
    }
}

@ccclass("InputKey")
export class InputKey {
    public keyCode: number = 0;

    public dispose(): void {
        this.keyCode = 0;
    }
}