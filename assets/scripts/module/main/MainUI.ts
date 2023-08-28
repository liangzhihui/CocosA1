import { _decorator, Component, Node } from 'cc';
import { HpView } from './HpView';
import { ComboView } from './ComboView';
import { ResultUI } from '../result/ResultUI';
import { StartUI } from './StartUI';
import { Joystck } from '../../input/Joystck';
import { EntityBornData } from '../actor/entity/EntityBornData';
import { EntityForward, EntitySide } from '../../const/EntityConst';
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
        let bornData = EntityBornData.create();
        bornData.hp = 5;
        bornData.pos.set(0, 0)
        bornData.actorResUrl = "Role";
        bornData.weaponResUrl = "RoleWeapon";
        bornData.side = EntitySide.Our;
        bornData.forward = EntityForward.Right;

        A1.actorManager.createActor(bornData);
        this.closeView(this.startUI);
        this.openView(this.stick);
        this.openView(this.hp);

        bornData.dispose();
    }

    resetGame() {
        A1.actorManager.removeAllActors();
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

