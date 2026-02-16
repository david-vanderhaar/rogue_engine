import FollowAndRangedAttack from '../BehaviorChains/FollowAndRangedAttack';
import FollowAndThrowProjectile from '../BehaviorChains/FollowAndThrowProjectile';
import SpecialMove from '../BehaviorChains/SpecialMove';
import LightPowerUp from '../BehaviorChains/LightPowerUp';

function HitAndRunBehaviors(basicInfo) {
  return [
    // Phase 1: Close distance and maintain distance, then range attack
    ...new FollowAndRangedAttack({repeat:1}).create(),
    // ...new FollowAndThrowProjectile({repeat:1}).create(),
    // Phase 2: Special Move: move towards player and then do a special ranged attack (pushing enemy or wide splash)
    // Phase 3: Near unavoidable attack from range
  ];
}

export default HitAndRunBehaviors;