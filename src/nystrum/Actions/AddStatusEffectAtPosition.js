import { Base } from './Base';
import * as Helper from '../../helper'

export class AddStatusEffectAtPosition extends Base {
  constructor({ effect, targetPosition, processDelay = 25, ...args }) {
    super({ ...args });
    this.effect = effect;
    this.targetPosition = targetPosition;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    
    // get entity at target position
    const targets = Helper.getEntitiesByPosition({game: this.game, position: this.targetPosition});
    if (targets.length) {
      this.effect.actor = targets.at(0);
      success = this.game.engine.addStatusEffect(this.effect);
    }
    
    return {
      success,
      alternative: null,
    };
  }
}
;
