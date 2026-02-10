import Behavior from './Behavior';
import { MoveOrShove } from '../../../Actions/MoveOrShove';
import { MoveOrAttack } from '../../../Actions/MoveOrAttack';

export default class ExecuteMoveorAttackAlongPath extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  isValid () {
    return this.actor.getCursorPositions().length
  }

  constructActionClassAndParams () {
    return [
      MoveOrAttack,
      {
        targetPos: this.actor.getCursorPositions()[0],
        onAfter: () => {
          this.actor.setCursorPositions(this.actor.getCursorPositions().slice(1))
          this.actor.resetAnimations();
        }
      }
    ]
  }
}
