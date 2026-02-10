import Behavior from './Behavior';
import { MoveOrShove } from '../../../Actions/MoveOrShove';

export default class ExecuteMoveOrShoveAlongPath extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  isValid () {
    return this.actor.getCursorPositions().length
  }

  constructActionClassAndParams () {
    return [
      MoveOrShove,
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
