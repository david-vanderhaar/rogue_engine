import { Base } from './Base';
import { DestroySelf } from './DestroySelf';

export class ShoveOrDestroySelf extends Base {
  constructor({ targetPos, direction, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.direction = direction;
  }
  perform() {
    let success = false;
    let alternative = null;
    let moveSuccess = this.actor.shove(this.targetPos, this.direction);
    if (moveSuccess) {
      this.actor.energy -= this.energyCost;
      success = true;
    } else {
      success = true;
      alternative = new DestroySelf({
        game: this.game,
        actor: this.actor,
        energyCost: 0
      });
    }
    return {
      success,
      alternative,
    };
  }
}
;
