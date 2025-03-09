import { Move } from '../../../Actions/Move';
import Behavior from './Behavior';
import { calculatePathAroundObstacles, getPointsWithinRadius, getEntitiesByPosition } from '../../../../helper'; 
import { MoveOrAttack } from '../../../Actions/MoveOrAttack';

export default class MoveTowardsEnemyInRange extends Behavior {
  constructor({maintainDistanceOf = 1, range = 2, ...args }) {
    super({ ...args });
    this.chainOnFail = true;
    this.maintainDistanceOf = maintainDistanceOf
    this.range = range;
  }

  isValid () {
    return true;
  }

  getEntitiesInRange() {
    const positions = getPointsWithinRadius(this.actor.getPosition(), this.range)
    const entities = positions.reduce((acc, position) => {
      return [
        ...acc,
        ...getEntitiesByPosition({
          game: this.actor.game,
          position,
        })
      ]
    }, [])

    return entities.filter((entity) => this.actor.isEnemy(entity));
  }

  findClosestEnemy() {
    return this.getEntitiesInRange().at(0);
  }

  constructActionClassAndParams () {
    let actionClass = null;
    let actionParams = null;

    // find closest enemy
    const enemy = this.findClosestEnemy();
    if (!enemy) return [null, null]; 
    // get path to enemy
    let path = calculatePathAroundObstacles(this.actor.game, enemy.getPosition(), this.actor.getPosition());
    if (this.maintainDistanceOf > 0) path = path.slice(0, -this.maintainDistanceOf)
    let moveToPosition = path.length > 0 ? path[0] : null;
    if (!moveToPosition) return [null, null]

    actionClass = Move; 
    actionParams = {
      hidden: true,
      targetPos: moveToPosition,
    }

    return [actionClass, actionParams];
  }
}
