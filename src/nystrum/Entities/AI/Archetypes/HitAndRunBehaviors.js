import * as Constant from '../../../constants';
import * as Behaviors from '../Behaviors';
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../../../Modes/HiddenLeaf/sounds';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter';
import { OpenGates } from '../../../StatusEffects/OpenGates';

// Phase 1: Close distance and attack
function FollowAndRangedAttack(basicInfo) {
  return [
    new Behaviors.MoveTowardsEnemy({
      repeat: 4,
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
      targetRange: 8,
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
function UltimateMove(basicInfo) {
  return [
    new Behaviors.ExecuteStatusEffectOnSelf({
      repeat: 1,
      effectClass: OpenGates,
    })
  ]
}

function HitAndRunBehaviors(basicInfo) {
  return [
    // Phase 1: Close distance and maintain distance, then range attack
    ...Array(6).fill(FollowAndRangedAttack(basicInfo)).flat(),
    // Phase 2: Special Move: move towards player and then do a special ranged attack (pushing enemy or wide splash)
    ...Array(4).fill(SpecialMove(basicInfo)).flat(),
    // Phase 3: Near unavoidable attack from range
    ...Array(1).fill(UltimateMove(basicInfo)).flat(),
  ];
}

export default HitAndRunBehaviors;