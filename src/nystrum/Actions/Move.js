import { Base } from './Base';
import { Attack } from "./Attack";
import * as Constant from '../constants';

export class Move extends Base {
  constructor({ targetPos, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    let alternative = null;
    let moveSuccess = this.actor.move(this.targetPos);
    if (moveSuccess) {
      // this.actor.energy -= this.energyCost;
      success = true;
    }
    else {
      success = true;
      alternative = new Attack({
        targetPos: this.targetPos,
        game: this.game,
        actor: this.actor,
        energyCost: Constant.ENERGY_THRESHOLD
      });
    }
    return {
      success,
      alternative,
    };
  }
}
;
