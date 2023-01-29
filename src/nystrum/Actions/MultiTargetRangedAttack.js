import { Base } from './Base';
import { Say } from './Say';
import { Reload } from './Reload';
import * as Constant from '../constants';
import { JACINTO_SOUNDS } from '../Modes/Jacinto/sounds';
import * as Helper from '../../helper'
import { createParticleRendererGradient } from '../Entities/IsParticle';
import { COLORS } from '../Modes/Jacinto/theme';

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

    let renderer = this.particleTemplate.renderer;
    const actorPos = this.actor.getPosition()
    this.targetPositions.forEach((targetPos) => {
      let [attackSuccess, hit] = this.actor.rangedAttack(targetPos);
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
          const path = Helper.calculateAstar8Path(this.game, actorPos, targetPos);
          path.push({...targetPos})
          path.shift()

          const firstPos = path[0]
          path.forEach((pos, index) => {
            const particlePath = [...Array(index).fill({...firstPos}), ...path]
            this.addParticle({
              life: particlePath.length + 1,
              pos: {...firstPos},
              renderer,
              type: Constant.PARTICLE_TYPE.path,
              path: particlePath,
              particleRendererGradients: {
                ...createParticleRendererGradient('background', [COLORS.base02, COLORS.locust2]),
                ...createParticleRendererGradient('color', ['#ffffff', '#000000']),
              },
              particleAnimationTimeStep: 0.1
            });
          })
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
