import * as Constant from '../constants';
import * as Helper from '../../helper';
import { AddStatusEffect } from './AddStatusEffect';
import { OpenGates } from '../StatusEffects/OpenGates';

export class AddOpenGatesStatusEffect extends AddStatusEffect {
  constructor({ defenseBuff, ...args }) {
    super({ ...args });
    this.processDelay = 25
    this.effect = new OpenGates({
      game: this.game,
      actor: this.actor,
    });
    this.particleTemplate = {
      renderer: {
        color: '#3cc2bb',
        background: '#24fe88',
        character: '#'
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
