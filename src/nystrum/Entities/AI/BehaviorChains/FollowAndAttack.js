import BehaviorChain from "./BehaviorChain";
import * as Behaviors from '../Behaviors';
import * as Constant from '../../../constants';

// Close distance and attack
export default class FollowAndAttack extends BehaviorChain {
  constructor({ ...args }) {
    super(args);
  }

  behaviors() {
    return [
      new Behaviors.MoveTowardsEnemy({
        repeat: 4,
        maintainDistanceOf: -1, // causes to move and attack in same turn if close enough
        chainOnFail: true
      }),
      new Behaviors.TelegraphOnEnemy({
        repeat: 1,
        attackPattern: Constant.CLONE_PATTERNS.clover,
        chainOnSuccess: true
      }),
      new Behaviors.ExecuteAttack({repeat: 1}),
    ]
  }
}