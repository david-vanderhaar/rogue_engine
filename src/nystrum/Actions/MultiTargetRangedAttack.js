import { Base } from './Base';
import { Say } from './Say';
import { Reload } from './Reload';
import { JACINTO_SOUNDS } from '../Modes/Jacinto/sounds';
import { COLORS } from '../Modes/Jacinto/theme';
import GradientPathEmitter from '../Engine/Particle/Emitters/gradientPathEmitter';

export class MultiTargetRangedAttack extends Base {
  constructor({ targetPositions, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPositions = targetPositions;
    this.processDelay = processDelay;
    this.multiTargetRangedAttackHits = []
    this.multiTargetRangedAttackMisses = []
    this.onSuccess = () => {
      args?.onSuccess && args.onSuccess()
      this.handleSuccess()
    }
  }

  // handleWeaponFireSuccess() {
  //   const weapon = this.getFirstWeapon();
  //   if (!weapon) return false;
  //   if (weapon['afterFireSuccess'] === undefined) return false;

  //   weapon.afterFireSuccess({
  //     targetPositions: this.targetPositions,
  //     hits: this.multiTargetRangedAttackHits,
  //     misses: this.multiTargetRangedAttackMisses,
  //   });
  //   return true;
  // }
  
  async handleSuccess() {
    const weapon = this.getFirstWeapon();
    if (!weapon) return false;
    weapon.afterFireSuccess({
      fromPosition: weapon.getPosition(),
      targetPositions: this.targetPositions,
      hits: this.multiTargetRangedAttackHits,
      misses: this.multiTargetRangedAttackMisses,
    });
  }

  getFirstWeapon() {
    const weapons = this.actor.getEquipedWeapons();
    if (weapons.length <= 0) return null;
    return weapons[0];
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
