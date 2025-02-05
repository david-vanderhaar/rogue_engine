import * as Constant from '../constants';
import {Base as StatusEffectBase} from '../StatusEffects/Base';

export const TimeBombing = superclass => class extends superclass {
  constructor({ damagePerTick = 1, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('TIME_BOMBING');
    this.damagePerTick = damagePerTick;
    this.addStatusEffect()
  }

  createTimeBombStatusEffect() {
    return new StatusEffectBase({
      game: this.game,
      actor: this,
      name: 'Dying',
      lifespan: -1,
      stepInterval: Constant.ENERGY_THRESHOLD * 5,
      allowDuplicates: false,
      onStep: () => {
        this.decreaseDurability(this.damagePerTick);
      },
    });
  }

  addStatusEffect() {
    const effect = this.createTimeBombStatusEffect()
    this.game.engine.addStatusEffect(effect);
  }
};
