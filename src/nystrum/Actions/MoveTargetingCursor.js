import { Base } from './Base';
import * as Helper from '../../helper';

export class MoveTargetingCursor extends Base {
  constructor({ direction, range, targetPos, ...args }) {
    super({ ...args });
    this.direction = direction;
    this.range = range;
    this.targetPos = targetPos
    this.processDelay = 0;
    this.energyCost = 0;
    this.useEntityPassableMovementConstraint = false
  }
  canMoveCursor(targetPos) {
    return this.isInRange(targetPos) && this.canPass(targetPos)
  }

  canPass(targetPos) {
    if (this.useEntityPassableMovementConstraint) return this.game.canOccupyPosition(targetPos, this.actor)
    return this.game.canOccupyPosition(targetPos, {passable: true})
  }

  isInRange (targetPos) {
    if (!!!this.range) return true
    const initiatedFrom = this.actor.getPosition();
    const path = Helper.calculateStraightPath(initiatedFrom, targetPos);
    return path.length <= this.range;
  }

  updateLookedAt(positions) {
    const targets = positions.reduce((acc, pos) => {
      return [
        ...acc,
        ...Helper.getEntitiesByPosition({game: this.game, position: pos})
      ]
    }, [])

    this.game.entityLog.setLookedAt(targets)
  }

  perform() {
    let success = false;
    let alternative = null;
    if (!this.targetPos && !this.direction) {
      return {success, alternative}
    }

    let targetPos = this.targetPos;
    if (!this.targetPos) {
      targetPos = Helper.getPositionInDirection(this.actor.getCursorPositions()[0], this.direction);
    }

    if (this.canMoveCursor(targetPos)) {
      this.actor.moveCursorToPosition(targetPos);
      this.updateLookedAt([targetPos])
      success = true;
    }
    return {
      success,
      alternative,
    };
  }
}
;
