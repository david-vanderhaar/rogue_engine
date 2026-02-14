import { Say } from '../../../Actions/Say';
import Behavior from './Behavior';
import { PlaceActor } from '../../../Actions/PlaceActor';
import { DIRECTIONS } from '../../../constants';
import { getDirectionFromOrigin } from '../../../../helper';

export default class ExecutePlaceActor extends Behavior {
  constructor({ getItem, itemName, ...args }) {
    super({ ...args });
    this.getItem = getItem;
  }

  isValid () {
    return this.actor.getCursorPositions().length
  }

  constructActionClassAndParams () {
    // get target position from cursor positions, 
    // and item from getItem function, then return PlaceActor action with those params
    const targetPositions = this.actor.getCursorPositions();
    const item = this.getItem(this.actor.game.engine, this.actor.getPosition());
    const direction = getDirectionFromOrigin(targetPositions[0], targetPositions.at(-1));
    item.direction = [direction.x, direction.y];
    item.game = this.actor.game;
    
    return [
      PlaceActor,
      {
        targetPos: {...targetPositions[0]},
        entity: item,
        onBefore: () => {
          // item.direction = getDirectionFromOrigin(targetPositions[0], targetPositions.at(-1));
          // item.passable = true
        },
        onAfter: () => {
          this.actor.removeAnimations()
        }
      }
    ]
  }
}
