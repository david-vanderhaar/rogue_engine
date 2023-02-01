import { Base } from './Base';
import { Say } from './Say';
import { Reload } from './Reload';
import * as Constant from '../constants';
import { JACINTO_SOUNDS } from '../Modes/Jacinto/sounds';
import * as Helper from '../../helper'
import { COLORS } from '../Modes/Jacinto/theme';
import { ParticleEmitter } from '../Engine/Particle/particleEmitter';

export class MultiTargetRangedAttack extends Base {
  constructor({ targetPositions, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPositions = targetPositions;
    this.processDelay = processDelay;
    this.multiTargetRangedAttackHits = []
    this.multiTargetRangedAttackMisses = []
    this.onSuccess = () => {
      args?.onSuccess && args?.onSuccess()
      this.handleOnAfter()
    }
  }
  
  async handleOnAfter() {
    const emitter = new ParticleEmitter({
      game: this.game,
      easingFunction: Helper.EASING.linear,
      animationTimeStep: 0.2,
    })

    const actorPos = this.actor.getPosition()

    this.multiTargetRangedAttackHits.forEach((targetPos) => {
      const path = Helper.calculateAstar8Path(this.game, actorPos, targetPos);
      path.push({...targetPos})
      path.shift()

      const firstPos = path[0]
      path.forEach((pos, index) => {
        const particlePath = [...Array(index).fill({...firstPos}), ...path]
        emitter.addParticle({
          life: particlePath.length + 1,
          pos: {...firstPos},
          path: particlePath,
          rendererGradients: {
            color: [COLORS.base02, COLORS.locust2],
            backgroundColor: ['#ffffff', '#000000'],
          },
        });
      })
    })

    this.multiTargetRangedAttackMisses.forEach((targetPos) => {
      emitter.addParticle({
        life: 5,
        pos: {...targetPos},
        direction: {x: 0, y: 0},
      })
    })
    await emitter.start()
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

    this.targetPositions.forEach((targetPos) => {
      let [attackSuccess, hit] = this.actor.rangedAttack(targetPos);
      if (attackSuccess) {
        success = true;
        if (!hit) {
          this.multiTargetRangedAttackMisses.push(targetPos) 
        } else {
          this.multiTargetRangedAttackHits.push(targetPos) 
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
