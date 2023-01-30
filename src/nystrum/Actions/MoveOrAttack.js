import { Base } from './Base';
import { Attack } from "./Attack";
import { ParticleEmitter } from '../Engine/Particle/particleEmitter'
import * as Helper from '../../helper'
import { COLORS } from '../Modes/Jacinto/theme';

export class MoveOrAttack extends Base {
  constructor({ targetPos, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    let alternative = null;
    let moveSuccess = this.actor.move(this.targetPos);
    if (moveSuccess) {
      success = true;
    } else {
      alternative = new Attack({
        targetPos: this.targetPos,
        game: this.game,
        actor: this.actor,
        energyCost: this.energyCost
      });
    }

    const emitter = new ParticleEmitter({
      game: this.game,
      easingFunction: Helper.EASING.linear
    })

    emitter.addParticle({
      pos: this.actor.getPosition(),
      direction: {x: 1, y: 0},
      rendererGradients: {
        color: [COLORS.base02, COLORS.locust2],
        backgroundColor: ['#ffffff', '#000000'],
      },
    })
    emitter.addParticle({
      pos: this.actor.getPosition(),
      direction: {x: 0, y: 1}
    })

    emitter.start()

    return {
      success,
      alternative,
    };
  }
}
;
