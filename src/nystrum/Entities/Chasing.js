import * as Constant from '../constants';
import * as Helper from '../../helper';
import { MoveOrAttack } from '../Actions/MoveOrAttack';
import { Say } from '../Actions/Say';

export const Chasing = superclass => class extends superclass {
  constructor({ targetEntity = null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('CHASING');
    this.targetEntity = targetEntity;
  }

  getAction(game) {
    if (!this.targetEntity) return this.sayAction(game)
    
    let path = Helper.calculatePath(game, this.targetEntity.pos, this.pos);
    if (path.length <= 0) return this.sayAction(game)
    
    let targetPos = path[0];
    return new MoveOrAttack({
      targetPos,
      game,
      actor: this,
      energyCost: Constant.ENERGY_THRESHOLD
    });
  }

  sayAction(game) {
    return new Say({
      message: 'Where are they?',
      game,
      actor: this,
      energyCost: Constant.ENERGY_THRESHOLD
    });
  } 
};
