import Behavior from './Behavior';
import { PlaceActor } from '../../../Actions/PlaceActor';

export default class ExecutePlaceActor extends Behavior {
  constructor({ getItem, itemName, ...args }) {
    super({ ...args });
    this.getItem = getItem;
  }

  isValid () {
    return this.actor.getCursorPositions().length
  }

  constructActionClassAndParams () {
    const targetPositions = this.actor.getCursorPositions();
    const item = this.getItem(this.actor.game.engine, this.actor.getPosition());
    
    return [
      PlaceActor,
      {
        targetPos: {...targetPositions[0]},
        entity: item,
        onAfter: () => {
          this.actor.removeAnimations()
        }
      }
    ]
  }
}
