import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResultUI')
export class ResultUI extends Component {
    @property(Label)
    winLabel: Label = null;

    @property(Label)
    failLabel: Label = null;

    updateView(win: boolean) {
        this.winLabel.node.active = win;
        this.failLabel.node.active = !win;
    }
}

