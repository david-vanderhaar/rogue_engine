import { Base } from './Base';
import { Say } from './Say';
import * as Constant from '../constants';

export class MultiTargetAttackAndShove extends Base {
  constructor({ targetPositions, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPositions = targetPositions;
    this.processDelay = processDelay;
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
    let particlePath = [];
    let particlePos = { x: this.actor.pos.x, y: this.actor.pos.y };
    let renderer = this.particleTemplate.renderer;
    console.log('targetPositions', this.targetPositions);
    console.log('this.actor', this.actor.getPosition());
    this.targetPositions.forEach((targetPos) => {
      let attackSuccess = this.actor.attack(targetPos);
      particlePath.push(targetPos);
      if (attackSuccess) {
        success = true;
        let direction = [targetPos.x - this.actor.pos.x, targetPos.y - this.actor.pos.y];
        this.actor.shove(targetPos, direction, false);
      }
    });
    this.addParticle(particlePath.length + 1, particlePos, null, renderer, Constant.PARTICLE_TYPE.path, particlePath);
    if (success) {
      this.actor.energy -= this.energyCost;
    }
    return {
      success,
      alternative,
    };
  }
}
;
