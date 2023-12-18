import { MoveMultiple } from './MoveMultiple';
import { Attack } from './Attack';
import {ENERGY_THRESHOLD} from '../constants';

export class Tackle extends MoveMultiple {
  constructor({ direction, additionalDamage = 0, processDelay = 25, tackleRange = null, ...args }) {
    super({ ...args });
    this.direction = direction;
    this.stepCount = 0;
    this.additionalDamage = additionalDamage;
    this.processDelay = processDelay;
    this.tackleRange = tackleRange;
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

    if (this.actor.energy > ENERGY_THRESHOLD) {
      const shoveSuccess = this.actor.shove(targetPos, this.direction);
      if (shoveSuccess) {
        alternative = this
        for (let i = 0; i < 3; i++) {
          this.addParticle(1, {
            x: this.actor.pos.x - (this.direction[0] * i),
            y: this.actor.pos.y - (this.direction[1] * i),
          }, { x: 0, y: 0 });
        }

        this.stepCount += 1;
      }
    }

    return {
      success: true,
      alternative,
    };
  }
};
