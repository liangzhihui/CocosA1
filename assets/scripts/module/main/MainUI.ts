import { _decorator, Component, Node } from 'cc';
import { HpView } from './HpView';
import { ComboView } from './ComboView';
import { ResultUI } from '../result/ResultUI';
import { StartUI } from './StartUI';
import { Joystck } from '../../input/Joystck';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {
    @property(HpView)
    hp: HpView = null;

    @property(ComboView)
    combo: ComboView = null;

    @property(StartUI)
    startUI: StartUI = null;

    @property(ResultUI)
    resultUI: ResultUI = null;

    @property(Joystck)
    stick: Joystck = null;

    start(): void {
        this.openView(this.startUI);    
    }

    startGame() {
        A1.level.startLevel();
        this.closeView(this.startUI);
        this.openView(this.stick);
        this.openView(this.hp);
    }

    resetGame() {
        A1.level.resetLevel();
        this.closeView(this.hp);
        this.closeView(this.combo);
        this.closeView(this.resultUI);
        this.openView(this.startUI);
    }

    finishLevel(win: boolean) {
        this.closeView(this.stick);
        this.openView(this.resultUI);
        this.resultUI.updateView(win);
    }

    openView(view: Component) {
        view.node.active = true;
    }

    closeView(view: Component) {
        view.node.active = false;
    }
}

