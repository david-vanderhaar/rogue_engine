import { Tackle } from './Tackle';
import { Attack } from './Attack';
import {ENERGY_THRESHOLD} from '../constants';

export class TackleByRange extends Tackle {
  constructor({ range = 3, ...args }) {
    super({ ...args });
    this.range = range;
  }
  perform() {
    let alternative = null;
    let newX = this.actor.pos.x + this.direction[0];
    let newY = this.actor.pos.y + this.direction[1];
    let targetPos = { x: newX, y: newY };

    alternative = new Attack({
      targetPos,
      additionalDamage: this.additionalDamage || this.stepCount,
      game: this.game,
      actor: this.actor,
      energyCost: 0,
    });

    if (this.stepCount < this.range) {
      const shoveSuccess = this.actor.shove(targetPos, this.direction);
      if (shoveSuccess) {
        alternative = this
        this.stepCount += 1;
        // reset payed resources so that we can pay all at once at the end
        this.gainRequiredResources()
      }
    }

    return {
      success: true,
      alternative,
    };
  }
};
