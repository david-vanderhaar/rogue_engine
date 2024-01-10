import * as Constant from '../../../../constants';
import {RangedWeapon} from '../../../../Entities/index';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../theme';
import SOUNDS from '../../../../sounds';
import gradientPathEmitter from '../../../../Engine/Particle/Emitters/gradientPathEmitter';
import SpatterEmitter from '../../../../Engine/Particle/Emitters/spatterEmitter';
import * as Helper from '../../../../../helper';
import { ANIMATION_TYPES } from '../../../../Display/konvaCustom';

export function BeastBomb(engine, pos) {
  async function afterFireSuccess({fromPosition, targetPositions, hits, misses}) {
    const emitter = gradientPathEmitter({
      game: engine.game,
      fromPosition,
      targetPositions,
      backgroundColorGradient: [HIDDEN_LEAF_COLORS.base3, HIDDEN_LEAF_COLORS.red],
      colorGradient: [HIDDEN_LEAF_COLORS.base3, HIDDEN_LEAF_COLORS.red],
      animationTimeStep: 0.3,
    })

    await emitter.start()

    // choose random number of hits to explode
    // using the splatter emitter
    const randomHits = hits.filter(() => Math.random() < .5)
    if (randomHits.length === 0) randomHits.push(Helper.getRandomInArray(hits))
    randomHits.forEach(async (targetPos) => {
      const spatterRadius = 5
      const spatterAmount = .3
      const spatterDirection = {x: 0, y: 0}
      const spatterColors = [HIDDEN_LEAF_COLORS.wall, HIDDEN_LEAF_COLORS.red, HIDDEN_LEAF_COLORS.black]
      const animationTimeStep = 0.2
      const reverse = false
      const transfersBackground = false
      const transfersBackgroundOnDestroy = false
      
      const spatterEmitter = SpatterEmitter({
        game: engine.game,
        fromPosition: targetPos,
        spatterRadius,
        spatterAmount,
        spatterDirection,
        spatterColors,
        animationTimeStep,
        reverse,
        transfersBackground,
        transfersBackgroundOnDestroy,
      })
      await spatterEmitter.start()
    })
  }

  return new RangedWeapon({
    game: engine.game,
    name: 'Beast Bomb',
    passable: true,
    lightPassable: true,
    attackRange: 9,
    magazineSize: Infinity,
    baseRangedAccuracy: Infinity,
    baseRangedDamage: 3,
    attackDamage: 0,
    pos,
    shapePattern: Constant.CLONE_PATTERNS.point,
    equipmentType: 'Beast Bomb',
    renderer: {
      character: '',
      color: HIDDEN_LEAF_COLORS.black,
      background: HIDDEN_LEAF_COLORS.orange,
    },
    // rangedHitSounds: [SOUNDS.explosion_0],
    // rangedMissSounds: [SOUNDS.explosion_0],
    afterFireSuccess: afterFireSuccess,
  });
}
