import BehaviorChain from "./BehaviorChain";
import * as Behaviors from '../Behaviors';
import { Katon } from '../../../Modes/HiddenLeaf/Items/Weapons/Katon';

export default class FollowAndRangedAttack extends BehaviorChain {
  constructor({ ...args }) {
    super(args);
  }

  behaviors() {
    return [
      new Behaviors.MoveTowardsEnemy({
        repeat: 4,
        maintainDistanceOf: 6,
        chainOnFail: true
      }),
      new Behaviors.ExecuteEquipItem({
        repeat: 1,
        getItem: Katon,
        itemName: 'Katon Jutsu',
        chainOnFail: true,
      }),
      new Behaviors.TelegraphRangedAttack({repeat: 1, chainOnSuccess: false}),
      new Behaviors.ExecuteRangedAttack({repeat: 1}),
      new Behaviors.MoveAwayFromEnemy({
        repeat: 4,
        maintainDistanceOf: 6,
        chainOnFail: true
      }),
    ];
  }
}
