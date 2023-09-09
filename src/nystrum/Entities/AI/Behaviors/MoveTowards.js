import { Move } from '../../../Actions/Move';
import Behavior from './Behavior';
import * as Helper from '../../../../helper'; 

export default class MoveTowardsEntityInRangeByAttr extends Behavior {
  constructor({range = 3, attribute = 'name', attributeValue = null, ...args }) {
    super({...args });

    this.range = range
    this.attribute = attribute
    this.attributeValue = attributeValue
    this.target = null
  }

  isValid() {
    return true
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

  constructActionClassAndParams () {
    let actionClass = null;
    let actionParams = null;

    let moveToPosition = this.actor.getPosition();

    if (!this.target) this.target = Helper.getRandomInArray(this.getEntitiesInRange())
    if (!this.target) return [actionClass, actionParams]; 

    // get path to target
    let path = Helper.calculatePathAroundObstacles(
      this.actor.game,
      this.target.getPosition(),
      this.actor.getPosition()
    );

    moveToPosition = path.length > 0 ? path[0] : null;

    actionClass = Move; 
    actionParams = {
      hidden: true,
      targetPos: moveToPosition,
    }

    return [actionClass, actionParams];
  }
}
