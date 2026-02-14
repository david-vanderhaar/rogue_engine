import BehaviorChain from "./BehaviorChain";
import * as Behaviors from '../Behaviors';
import { OpenGates } from '../../../StatusEffects/OpenGates';

export default class LightPowerUp extends BehaviorChain {
  constructor({ ...args }) {
    super(args);
  }

  behaviors() {
    return [
      new Behaviors.ExecuteStatusEffectOnSelf({
        repeat: 1,
        effectClass: OpenGates,
      })
    ];
  }
}
