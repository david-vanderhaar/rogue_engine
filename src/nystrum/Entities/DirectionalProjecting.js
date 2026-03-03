import * as Constant from '../constants';
import { ProjectileMove } from '../Actions/ProjectileMove';
import { DestroySelf } from '../Actions/DestroySelf';
import { Wait } from '../Actions/Wait';
import { removeEntityFromEngine } from './helper';
import { Say } from '../Actions/Say';

export const DirectionalProjecting = superclass => class extends superclass {
  constructor({ path = false, direction = { x: 0, y: 0 }, attackDamage = 1, range = 3, damageToSelf = 1, remainAfterUse = false, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('DIRECTIONAL_PROJECTING');
    this.path = path;
    this.direction = direction;
    this.attackDamage = attackDamage;
    this.range = range;
    this.damageToSelf = damageToSelf;
    this.remainAfterUse = remainAfterUse;
  }
  createPath(game) {
    let path = [];
    for (let i = 1; i < this.range + 1; i++) {
      path.push({
        x: this.pos.x + (this.direction[0] * i),
        y: this.pos.y + (this.direction[1] * i)
      });
    }
    this.path = path;
  }
  getAction(game) {
    let result = null;
    let newX = this.pos.x + this.direction[0];
    let newY = this.pos.y + this.direction[1];
    let targetPos = { x: newX, y: newY };
    this.passable = false;
    if (this.range > 0) {
      result = new ProjectileMove({
        targetPos: targetPos,
        game: game,
        actor: this,
        energyCost: Constant.ENERGY_THRESHOLD,
        damageToSelf: this.damageToSelf,
        onSuccess: () => this.range -= 1,
        onAfter: () => {
          if (this.energy <= 100) {
            game.engine.setActorToPrevious();
          }
        }
      });
    } else {
      if (this.remainAfterUse) {
        result = new Wait({
          game: game,
          actor: this,
          energyCost: 100,
          onSuccess: () => {
            removeEntityFromEngine(this)
          }
        });
      } else {
        result = new DestroySelf({
          game: game,
          actor: this,
          energyCost: 0
        });
      }
    }
    return result;
  }
};
