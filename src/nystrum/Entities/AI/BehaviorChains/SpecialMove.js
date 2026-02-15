import BehaviorChain from "./BehaviorChain";
import * as Behaviors from '../Behaviors';
import * as Constant from '../../../constants';
// import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../../../Modes/HiddenLeaf/sounds';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter';

export default class SpecialMove extends BehaviorChain {
  constructor({ ...args }) {
    super(args);
  }

  behaviors() {
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
      new Behaviors.TelegraphOnEnemy({
        repeat: 1,
        attackPattern: Constant.CLONE_PATTERNS.clover,
        chainOnSuccess: true
      }),
      new Behaviors.ExecuteAttack({repeat: 1}),
      // new Behaviors.MoveAwayFromEnemy({ repeat: 3, maintainDistanceOf: 3 }),
    ];
  }
}
