import { Base } from './Base';
import { Say } from './Say';
import { Reload } from './Reload';
import * as Constant from '../constants';
import { JACINTO_SOUNDS } from '../Modes/Jacinto/sounds';
import * as Helper from '../../helper'

export class MultiTargetRangedAttack extends Base {
  constructor({ targetPositions, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPositions = targetPositions;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    let alternative = null;
    if (!this.actor.entityTypes.includes('RANGED_ATTACKING')) {
      return {
        success: true,
        alternative: new Say({
          message: `Ooh I don\'t know how to attack`,
          game: this.game,
          actor: this.actor,
        }),
      };
    }
    const weapons = this.actor.getEquipedWeapons();
    if (weapons.length > 0) {
      if (weapons[0].magazine <= 0) {
        JACINTO_SOUNDS.needs_reload.play()
        return {
          success: false,
          alternative: null
        };
        // return {
        //   success: true,
        //   alternative: new Reload({
        //     game: this.game,
        //     actor: this.actor,
        //     energyCost: Constant.ENERGY_THRESHOLD,
        //   }),
        // };
      }
    }
    let particlePath = [];
    let renderer = this.particleTemplate.renderer;
    const actorPos = this.actor.getPosition()
    this.targetPositions.forEach((targetPos) => {
      let [attackSuccess, hit] = this.actor.rangedAttack(targetPos);
      particlePath.push(targetPos);
      if (attackSuccess) {
        success = true;
        if (!hit) {
          this.addParticle(
            1,
            { ...targetPos },
            { x: 0, y: 0 },
            Constant.PARTICLE_TEMPLATES.fail.renderer,
          );
        } else {
          const path = Helper.calculateStraightPath(actorPos, targetPos);
          console.log('from action');
          console.log(path);
          this.addParticle(
            path.length + 1,
            {...actorPos},
            null,
            renderer,
            Constant.PARTICLE_TYPE.path,
            path
          );
        }
      }
    });
    return {
      success,
      alternative,
    };
  }
}
;
