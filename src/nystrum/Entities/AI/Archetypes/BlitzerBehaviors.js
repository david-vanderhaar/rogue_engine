import FollowAndAttack from '../BehaviorChains/FollowAndAttack';
import SpecialMove from '../BehaviorChains/SpecialMove';
import LightPowerUp from '../BehaviorChains/LightPowerUp';

function BlitzerBehaviors(basicInfo) {
  return [
    // Phase 1: Close distance and attack
    ...new FollowAndAttack({repeat: 6}).create(),
    // Phase 2: Special Move
    ...new SpecialMove({repeat: 4}).create(),
    // Phase 3: Apply Light Power Up
    ...new LightPowerUp({repeat: 1}).create(),
  ];
}

export default BlitzerBehaviors;