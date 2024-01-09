import * as Constant from '../../../../constants';
import {RangedWeapon} from '../../../../Entities/index';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../../HiddenLeaf/theme';
import SOUNDS from '../../../../sounds';
import gradientPathEmitter from '../../../../Engine/Particle/Emitters/gradientPathEmitter';
import SpatterEmitter from '../../../../Engine/Particle/Emitters/spatterEmitter';
import { getNumberOfItemsInArray, getRandomInArray } from '../../../../../helper';

export function UzumakiBarrage(engine, pos) {
  async function afterFireSuccess({fromPosition, targetPositions, hits, misses}) {

    // pick five positions to around target position at same distance
    // u - zu - ma - ki - barrage!
    // create a gradient path emitter from the fromPosition to the targetPositions
    // start emitters in sequence, await each one

    const emitter = gradientPathEmitter({
      game: engine.game,
      fromPosition,
      targetPositions,
      pathTailLength: 3,
      backgroundColorGradient: [Constant.THEMES.SOLARIZED.red, Constant.THEMES.SOLARIZED.red],
      colorGradient: [Constant.THEMES.SOLARIZED.red, Constant.THEMES.SOLARIZED.violet],
      animationTimeStep: 0.1,
    })
  
    await emitter.start()

    // choose random number of hits to explode
    // using the splatter emitter
    const randomHits = hits.filter(() => Math.random() < .5)
    if (randomHits.length === 0) randomHits.push(getRandomInArray(hits))
    randomHits.forEach(async (targetPos) => {
      const spatterRadius = 5
      const spatterAmount = .3
      const spatterDirection = {x: 0, y: 0}
      const spatterColors = [HIDDEN_LEAF_COLORS.red, HIDDEN_LEAF_COLORS.yellow]
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
    name: 'Uzumaki Barrage',
    passable: true,
    lightPassable: true,
    attackRange: 3,
    magazineSize: Infinity,
    baseRangedAccuracy: Infinity,
    baseRangedDamage: 3,
    attackDamage: 0,
    pos,
    shapePattern: Constant.CLONE_PATTERNS.point,
    equipmentType: Constant.EQUIPMENT_TYPES.JUTSU,
    renderer: {
      character: '',
      color: HIDDEN_LEAF_COLORS.black,
      background: HIDDEN_LEAF_COLORS.orange,
    },
    // rangedHitSounds: [SOUNDS.explosion_0],
    // rangedMissSounds: [SOUNDS.explosion_0],
    afterFireSuccess: afterFireSuccess,
  });
}
