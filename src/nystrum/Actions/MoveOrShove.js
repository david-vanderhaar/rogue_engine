import { Base } from './Base';
import { Attack } from "./Attack";

export class MoveOrShove extends Base {
  constructor({ targetPos, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.processDelay = processDelay;
  }

  perform() {
    let success = false;
    let alternative = null;

    let direction = [this.targetPos.x - this.actor.pos.x, this.targetPos.y - this.actor.pos.y];
    let shoveSuccess = this.actor.shove(this.targetPos, direction, true);
    
    if (shoveSuccess) return { success: true, alternative: null };
    
    let moveSuccess = this.actor.move(this.targetPos);
    if (moveSuccess) return { success: true, alternative: null };

    return {
      success,
      alternative,
    };
  }
}
;
