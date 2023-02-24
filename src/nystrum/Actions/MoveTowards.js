import { Base } from './Base';
import * as Helper from '../../helper'

export class MoveTowards extends Base {
  constructor({ targetPos, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
  }

  perform() {
    let success = false;
    let alternative = null;

    const currentPos = this.actor.getPosition()
    const path = Helper.calculatePathAroundObstacles(this.game, this.targetPos, currentPos)
    if (path.length > 0) {
      this.actor.move(path[0])
      success = true;
    }

    return {
      success,
      alternative,
    };
  }
}
;
