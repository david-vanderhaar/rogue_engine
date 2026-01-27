import * as Constant from '../../../constants';
import * as Behaviors from '../Behaviors';

function BlitzerBehaviors(basicInfo) {
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

export default BlitzerBehaviors;