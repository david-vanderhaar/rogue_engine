import * as Constant from '../constants';
import * as Helper from '../../helper';
import { AddStatusEffect } from './AddStatusEffect';
import { NineTailsBeastMode } from '../Modes/HiddenLeaf/StatusEffects/NineTailsBeastMode';
import { COLORS as HIDDEN_LEAF_COLORS } from '../Modes/HiddenLeaf/theme';

export class AddNineTailsStatusEffect extends AddStatusEffect {
  constructor({ ...args }) {
    super({ ...args });
    this.processDelay = 25
    this.effect = new NineTailsBeastMode({
      game: this.game,
      actor: this.actor,
      lifespan: Constant.ENERGY_THRESHOLD * 20,
    });
    this.particleTemplate = {
      renderer: {
        character: '✦️',
        color: HIDDEN_LEAF_COLORS.black,
        background: HIDDEN_LEAF_COLORS.sasuke_alt,
      }
    };
  }
  perform() {
    let success = this.game.engine.addStatusEffect(this.effect);
    let positions = Helper.getPointsOnCircumference(this.actor.pos.x, this.actor.pos.y, 4);
    positions.forEach((pos) => {
      this.addParticle(3, { ...pos }, {
        x: -1 * Math.sign(pos.x - this.actor.pos.x),
        y: -1 * Math.sign(pos.y - this.actor.pos.y)
      });
    });
    return {
      success,
      alternative: null,
    };
  }
};
