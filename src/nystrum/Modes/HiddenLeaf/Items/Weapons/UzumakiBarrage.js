import * as Constant from '../../../../constants';
import {RangedWeapon} from '../../../../Entities/index';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../../HiddenLeaf/theme';
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../../sounds';

import gradientPathEmitter from '../../../../Engine/Particle/Emitters/gradientPathEmitter';
import SpatterEmitter from '../../../../Engine/Particle/Emitters/spatterEmitter';
import * as Helper from '../../../../../helper';
import { ANIMATION_TYPES } from '../../../../Display/konvaCustom';

export function UzumakiBarrage(engine, pos) {
  async function afterFireSuccess({fromPosition, targetPositions, hits, misses}) {

    HIDDEN_LEAF_SOUNDS.swift_move.play();

    // pick five positions to around target position at same distance
    // u - zu - ma - ki - barrage!
    // create a gradient path emitter from the fromPosition to the targetPositions
    // start emitters in sequence, await each one

    const characters = ['u', 'zu', 'ma', 'ki', 'barrage!']
    const points = Helper.getPointsOnCircumference(targetPositions[0].x, targetPositions[0].y, 5)

    const randomPoints = Helper.getNumberOfItemsInArray(5, points)

    const emitters = randomPoints.map((point, index) => {
      const emitter = gradientPathEmitter({
        game: engine.game,
        fromPosition: point,
        targetPositions,
        pathTailLength: 1,
        backgroundColorGradient: [HIDDEN_LEAF_COLORS.orange, HIDDEN_LEAF_COLORS.orange],
        colorGradient: [HIDDEN_LEAF_COLORS.black, HIDDEN_LEAF_COLORS.black],
        animationTimeStep: 0.5,
        character: 'N'
      })
      
      return emitter
    })

    // apply each emitter in sequence
    for (let i = 0; i < emitters.length; i++) {
      await emitters[i].start()
      HIDDEN_LEAF_SOUNDS.punch_01.play();
      engine.game.display.addAnimation(
        ANIMATION_TYPES.TEXT_FLOAT,
        {
          ...targetPositions[0],
          color: HIDDEN_LEAF_COLORS.black,
          text: characters[i],
        }
      );
    }

    // choose random number of hits to explode
    // using the splatter emitter
    const randomHits = hits.filter(() => Math.random() < .5)
    if (randomHits.length === 0) randomHits.push(Helper.getRandomInArray(hits))
    randomHits.forEach(async (targetPos) => {
      const spatterRadius = 5
      const spatterAmount = .3
      const spatterDirection = {x: 0, y: 0}
      const spatterColors = [HIDDEN_LEAF_COLORS.base1, HIDDEN_LEAF_COLORS.base3]
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
    equipmentType: 'Uzumaki Barrage',
    renderer: {
      character: '',
      color: HIDDEN_LEAF_COLORS.black,
      background: HIDDEN_LEAF_COLORS.orange,
    },
    rangedHitSounds: [
      HIDDEN_LEAF_SOUNDS.swift_move,
      HIDDEN_LEAF_SOUNDS.punch_01,
      HIDDEN_LEAF_SOUNDS.punch_02,
      // HIDDEN_LEAF_SOUNDS.punch_03,
      // HIDDEN_LEAF_SOUNDS.punch_04,
      // HIDDEN_LEAF_SOUNDS.punch_05,
      // HIDDEN_LEAF_SOUNDS.punch_06,
      // HIDDEN_LEAF_SOUNDS.punch_07,
      // HIDDEN_LEAF_SOUNDS.punch_08,
    ],
    // rangedMissSounds: [SOUNDS.explosion_0],
    afterFireSuccess: afterFireSuccess,
  });
}
