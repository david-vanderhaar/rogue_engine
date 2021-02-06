import { MoveMultiple } from './MoveMultiple';
import { Attack } from './Attack';

export class Tackle extends MoveMultiple {
  constructor({ direction, stepCount, additionalAttackDamage = 0, processDelay = 25, ...args }) {
    super({ ...args });
    this.direction = direction;
    this.stepCount = stepCount;
    this.stepsRemaining = stepCount;
    this.additionalAttackDamage = additionalAttackDamage;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    let alternative = null;
    let newX = this.actor.pos.x + this.direction[0];
    let newY = this.actor.pos.y + this.direction[1];
    let targetPos = { x: newX, y: newY };
    this.stepsRemaining -= 1;
    if (this.stepsRemaining >= 0 && this.actor.shove(targetPos, this.direction)) {
      alternative = this
      for (let i = 0; i < 3; i++) {
        this.addParticle(1, {
          x: this.actor.pos.x - (this.direction[0] * i),
          y: this.actor.pos.y - (this.direction[1] * i),
        }, { x: 0, y: 0 });
      }
      success = true;
    } else {
      console.log('attack during tackle');
      success = true;
      alternative = new Attack({
        targetPos,
        additionalDamage: (this.stepCount - this.stepsRemaining - 1),
        // additionalDamage: this.additionalAttackDamage,
        game: this.game,
        actor: this.actor,
        energyCost: 0,
      });
    }
    return {
      success,
      alternative,
    };
  }
}
;
