import { Move } from '../../../Actions/Move';
import Behavior from './Behavior';
import { calculatePathAroundObstacles } from '../../../../helper'; 
import { MoveOrAttack } from '../../../Actions/MoveOrAttack';

export default class MoveAwayFromEnemy extends Behavior {
  constructor({maintainDistanceOf = 1, ...args }) {
    super({ ...args });
    // When both this chainOnFail and MoveTowardsEnemy's chainOnFail are true,
    // the AI gets stuck switching between the two behaviors.
    // this.chainOnFail = true;
    this.maintainDistanceOf = maintainDistanceOf
  }

  isValid () {
    return true;
  }

  getDistanceToTarget (target) {
    return calculatePathAroundObstacles(this.actor.game, target.getPosition(), this.actor.getPosition(), 8).length;
  }

  findClosestEnemy() {
    let currentClosestEnemy = null;
    this.actor.getEnemies().forEach((enemy) => {
      if (!currentClosestEnemy) currentClosestEnemy = enemy;
      const distanceToEnemy = this.getDistanceToTarget(enemy);
      const distanceToCurrentClosestEnemy = this.getDistanceToTarget(currentClosestEnemy);
      if (distanceToEnemy < distanceToCurrentClosestEnemy) {
        currentClosestEnemy = enemy;
      }
    });
    return currentClosestEnemy;
  }

  constructActionClassAndParams () {
    let actionClass = null;
    let actionParams = null;

    // find closest enemy
    const enemy = this.findClosestEnemy();
    if (!enemy) return [null, null]; 

    // Check current distance
    const currentDistance = this.getDistanceToTarget(enemy);
    if (currentDistance >= this.maintainDistanceOf) {
      // Already at or beyond desired distance, stay in place
      return [null, null];
    }

    // Calculate position away from enemy
    const actorPos = this.actor.getPosition();
    const enemyPos = enemy.getPosition();
    
    // Determine direction vector away from enemy
    const dx = actorPos.x - enemyPos.x;
    const dy = actorPos.y - enemyPos.y;
    
    // Calculate target position (one step further away)
    const targetPos = {
      x: actorPos.x + Math.sign(dx),
      y: actorPos.y + Math.sign(dy)
    };

    actionClass = Move; 
    actionParams = {
      hidden: true,
      targetPos: targetPos,
    }

    return [actionClass, actionParams];
  }
}
