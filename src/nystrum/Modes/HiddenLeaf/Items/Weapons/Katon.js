import * as Constant from '../../../../constants';
import {RangedWeapon} from '../../../../Entities/index';
import {COLORS} from '../../../Jacinto/theme';
import SOUNDS from '../../../../sounds';
import gradientPathEmitter from '../../../../Engine/Particle/Emitters/gradientPathEmitter';
import SpatterEmitter from '../../../../Engine/Particle/Emitters/spatterEmitter';
import { getNumberOfItemsInArray, getRandomInArray } from '../../../../../helper';

export function Katon(engine, pos) {
  async function afterFireSuccess({fromPosition, targetPositions, hits, misses}) {
    // called after multi target ranged attack
    // used to control fire animations

    // const posiitons = getNumberOfItemsInArray(2, hits)
    const emitter = gradientPathEmitter({
      game: engine.game,
      fromPosition,
      // targetPositions: posiitons,
      targetPositions,
      pathTailLength: 3,
      backgroundColorGradient: [Constant.THEMES.SOLARIZED.red, Constant.THEMES.SOLARIZED.red],
      colorGradient: [Constant.THEMES.SOLARIZED.red, Constant.THEMES.SOLARIZED.violet],
      animationTimeStep: 0.6,
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
      const spatterColors = [COLORS.red, COLORS.yellow]
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
    name: 'Katon Jutsu',
    passable: true,
    lightPassable: true,
    attackRange: 20,
    magazineSize: Infinity,
    baseRangedAccuracy: Infinity,
    baseRangedDamage: 2,
    attackDamage: 0,
    pos,
    shapePattern: Constant.CLONE_PATTERNS.square,
    equipmentType: Constant.EQUIPMENT_TYPES.HAND,
    renderer: {
      character: '',
      color: COLORS.red,
      background: COLORS.base02,
    },
    rangedHitSounds: [SOUNDS.explosion_0],
    rangedMissSounds: [SOUNDS.explosion_0],
    afterFireSuccess: afterFireSuccess,
  });
}

// export const Katon = (engine, range) => new ThrowableSpawner({
//   game: engine.game,
//   name: 'Katon',
//   passable: false,
//   renderer: {
//     character: '*',
//     sprite: '',
//     color: COLORS.red,
//     background: COLORS.base02,
//   },
//   attackDamage: 0,
//   speed: Constant.ENERGY_THRESHOLD * range,
//   energy: 0,
//   spawnStructure: Constant.CLONE_PATTERNS.spread,
//   spawnedEntityClass: DirectionalProjectile,
//   spawnedEntityOptions: {
//     speed: Constant.ENERGY_THRESHOLD * 8,
//     range: 8,
//     passable: true,
//     renderer: {
//       character: '*',
//       sprite: '',
//       color: COLORS.red,
//       background: null,
//       animation: [
//         { background: null, color: COLORS.red, character: '*', sprite: '', passable: true, },
//         { background: null, color: COLORS.yellow, character: '*', sprite: '', passable: true, },
//         { background: null, color: COLORS.yellow, character: '*', sprite: '', passable: true, },
//       ]
//     },
//     name: 'Fire',
//     game: engine.game,
//   },
//   range,
//   onDestroy: (actor) => {
//     JACINTO_SOUNDS.smoke_grenade_fire.play()
//     actor.spawnEntities()
//   },
// })
