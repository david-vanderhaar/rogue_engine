import * as Constant from '../../../constants';
import * as Behaviors from '../Behaviors';
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../../../Modes/HiddenLeaf/sounds';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter';
import { chain } from 'lodash';

// Phase 1: Close distance and attack
function FollowAndAttack(basicInfo) {
  return [
    new Behaviors.MoveTowardsEnemy({
      repeat: basicInfo.speed/Constant.ENERGY_THRESHOLD,
      maintainDistanceOf: -1, // causes to move and attack in same turn if close enough
      chainOnFail: true
    }),
    new Behaviors.Telegraph({
      repeat: 1,
      attackPattern: Constant.CLONE_PATTERNS.clover,
      chainOnSuccess: true
    }),
    new Behaviors.ExecuteAttack({repeat: 1}),
  ]
}

// Phase 2: Special Move
function SpecialMove(basicInfo) {
  return [
    new Behaviors.TelegraphPathTowards({
      attribute: 'faction',
      attributeValue: 'PLAYER',
      targetRange: 6,
      detectionRange: 20,
      repeat: 1,
    }),
    new Behaviors.ExecuteMoveorAttackAlongPath({
    // new Behaviors.ExecuteMoveorShoveAlongPath({
      repeat: 6,
      extraActionParams: {
        onSuccess: ({actor}) => {
          // HIDDEN_LEAF_SOUNDS.wind_slice.play()
          SpatterEmitter({
            game: actor.game,
            fromPosition: actor.getPosition(),
            spatterAmount: 0.1,
            spatterRadius: 3,
            animationTimeStep: 0.6,
            transfersBackground: false,
            spatterColors: ['#36635b', '#F0D8C0', '#495877']
          }).start()
        }
      },
      // chainOnSuccess: true,
    }),
    new Behaviors.MoveTowardsEnemy({ repeat: 2, maintainDistanceOf: 0 , chainOnSuccess: true}),
    new Behaviors.Telegraph({
      repeat: 1,
      attackPattern: Constant.CLONE_PATTERNS.clover,
      chainOnSuccess: true
    }),
    new Behaviors.ExecuteAttack({repeat: 1}),
    // new Behaviors.MoveAwayFromEnemy({ repeat: 3, maintainDistanceOf: 3 }),
  ]
}

// Phase 3: Apply Light Power Up
function LightPowerUp(basicInfo) {
  return [
  ]
}

// Phase 4: Apply Full Power Up (Inner Gates)
function FullPowerUp(basicInfo) {
  return [
  ]
}

function BlitzerBehaviors(basicInfo) {
  return [
    // Phase 1: Close distance and attack
    // ...Array(2).fill(FollowAndAttack(basicInfo)).flat(),
    // Phase 2: Special Move
    ...Array(1).fill(SpecialMove(basicInfo)).flat(),
    // Phase 3: Apply Light Power Up
    // ...Array(1).fill(LightPowerUp(basicInfo)).flat(),
    // Phase 4: Apply Full Power Up (Inner Gates)
    // ...Array(1).fill(FullPowerUp(basicInfo)).flat(),
  ];
}

export default BlitzerBehaviors;