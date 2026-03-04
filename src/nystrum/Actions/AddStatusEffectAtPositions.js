import { Base } from './Base';
import * as Helper from '../../helper'
import { GLOBAL_EVENT_BUS } from '../Events/EventBus';

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
        const success = this.game.engine.addStatusEffect(effect)
        successes.push(success);

        if (success) {
          this.sendGameEvents(effect);
        }
      }
    });

    return {
      success: successes.some((i) => i === true),
      alternative: null,
    };
  }

  sendGameEvents(effect) {
    const target = effect.actor;  
    GLOBAL_EVENT_BUS.emit(`${this.actor.id}:apply_status_effect_${effect.name}:${target.id}`);
    GLOBAL_EVENT_BUS.emit(`${this.actor.id}:apply_status_effect_${effect.name}`);
    GLOBAL_EVENT_BUS.emit(`${this.actor.id}:apply_status_effect_${effect.name}:${target.name}`);
    GLOBAL_EVENT_BUS.emit(`${this.actor.name}:apply_status_effect_${effect.name}:${target.name}`);
    GLOBAL_EVENT_BUS.emit(`${this.actor.name}:apply_status_effect_${effect.name}`);
  }
}
;
