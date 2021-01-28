import { AddStatusEffect } from './AddStatusEffect';
import { SandSkin } from '../StatusEffects/SandSkin';
import * as Constant from '../constants';

export class AddSandSkinStatusEffect extends AddStatusEffect {
  constructor({ defenseBuff, ...args }) {
    super({ ...args });
    this.processDelay = 25
    this.effect = new SandSkin({
      defenseBuff,
      game: this.game,
      actor: this.actor,
      lifespan: Constant.ENERGY_THRESHOLD * 10,
      stepInterval: Constant.ENERGY_THRESHOLD,
    });
    this.particleTemplate = {
      renderer: {
        character: '✦️',
        color: '#A89078',
        background: '#D8C0A8',
      }
    };
  }
}
;
