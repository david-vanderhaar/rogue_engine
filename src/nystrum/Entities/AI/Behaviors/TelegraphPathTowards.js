import { Say } from '../../../Actions/Say';
import * as Helper from '../../../../helper';
import {COLORS} from '../../../Modes/Jacinto/theme';
import Behavior from './Behavior';

export default class TelegraphPathTowards extends Behavior {
  constructor({ attribute = 'name', attributeValue = null, range = 10, color = COLORS.red, ...args }) {
    super({ ...args });
    this.attribute = attribute;
    this.attributeValue = attributeValue;
    this.range = range;
    this.color = color;
  }

  isValid () {
    return true;
  }

  getEntitiesInRange() {
    const positions = Helper.getPointsWithinRadius(this.actor.getPosition(), this.range)
    const entities = positions.reduce((acc, position) => {
      return [
        ...acc,
        ...Helper.getEntitiesByPositionByAttr({
          game: this.actor.game,
          position,
          attr: this.attribute,
          value: this.attributeValue,
        })
      ]
    }, [])

    return entities
  }

  getTarget() {
    return Helper.getRandomInArray(this.getEntitiesInRange());
  }

  getPathToTarget(targetPosition) {
    // get path to target
    let path = Helper.calculatePathAroundObstacles(
      this.actor.game,
      targetPosition,
      this.actor.getPosition()
    );
    return path;
  }

  constructActionClassAndParams () {
    const target = this.getTarget();
    if (!target) return [null, null];

    const targetPosition = target.getPosition();
    const path = this.getPathToTarget(targetPosition);
    if (path.length === 0) return [null, null];

    // add blink animations or particle animation to targeted tiles
    this.actor.activateCursor(path);
    this.actor.updateAllCursorNodes([
      {key: 'fill', value: this.color}, 
      {key: 'stroke', value: 'transparent'}, 
    ]);
    // (or add telegraph entities to map?)
    // or produce and insert Execute behavior based on attack pattern?
    // return None action
    return [
      Say,
      {
        message: 'I am telegraphing my path',
        processDelay: 100,
      }
    ]
  }
}
