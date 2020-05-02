import { MoveMultiple } from './MoveMultiple';
export class Tackle extends MoveMultiple {
  constructor({ direction, stepCount, additionalAttackDamage = 0, processDelay = 25, ...args }) {
    super({ ...args });
    this.direction = direction;
    this.stepCount = stepCount;
    this.additionalAttackDamage = additionalAttackDamage;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    let alternative = null;
    let newX = this.actor.pos.x + this.direction[0];
    let newY = this.actor.pos.y + this.direction[1];
    let targetPos = { x: newX, y: newY };
    if (this.stepCount > 0 && this.actor.shove(targetPos, this.direction)) {
      this.stepCount -= 1;
      this.actor.energy -= this.energyCost;
      this.actor.setNextAction(this);
      for (let i = 0; i < 3; i++) {
        this.addParticle(1, {
          x: this.actor.pos.x - (this.direction[0] * i),
          y: this.actor.pos.y - (this.direction[1] * i),
        }, { x: 0, y: 0 });
      }
      success = true;
    }
    else {
      success = true;
      this.actor.attack(targetPos, this.additionalAttackDamage);
    }
    return {
      success,
      alternative,
    };
  }
}
;
