import { Base } from './Base';
import * as Helper from '../../helper'

export class AddStatusEffectAtPositions extends Base {
  constructor({ createEffect, targetPositions, processDelay = 25, ...args }) {
    super({ ...args });
    this.createEffect = createEffect;
    this.targetPositions = targetPositions;
    this.processDelay = processDelay;
  }
  perform() {
    let successes = []
    
    this.targetPositions.forEach((position) => {
      // get entity at target position
      const targets = Helper.getEntitiesByPosition({game: this.game, position: position});
      if (targets.length) {
        const effect = this.createEffect()
        effect.actor = targets.at(0);
        successes.push(this.game.engine.addStatusEffect(effect));
      }
    });

    return {
      success: successes.some((i) => i === true),
      alternative: null,
    };
  }
}
;
