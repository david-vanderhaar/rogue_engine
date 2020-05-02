import SOUNDS from '../sounds';
import { Base } from './Base';
import { Say } from './Say';
import * as Helper from '../../helper';
import * as Constant from '../constants';

export class Attack extends Base {
  constructor({ targetPos, processDelay = 100, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.processDelay = processDelay;
    this.particleTemplate = Constant.PARTICLE_TEMPLATES.damage;
  }
  perform() {
    let success = false;
    let alternative = null;
    if (!this.actor.entityTypes.includes('ATTACKING')) {
      return {
        success: true,
        alternative: new Say({
          message: `Ooh I don\'t know how to attack`,
          game: this.game,
          actor: this.actor,
        }),
      };
    }
    success = this.actor.attack(this.targetPos);
    if (success) {
      const sound = Helper.getRandomInArray([SOUNDS.chop_0, SOUNDS.chop_1]);
      sound.play();
      this.addParticle(1, { ...this.targetPos }, { x: 0, y: 0 });
      this.actor.energy -= this.energyCost;
    }
    return {
      success,
      alternative,
    };
  }
}
;
