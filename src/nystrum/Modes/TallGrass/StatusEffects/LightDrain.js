import {Base} from '../../../StatusEffects/Base';
import { COLORS } from '../theme';

export class LightDrain extends Base {
  constructor({...args}) {
    super({ ...args });
    this.name = 'light drain';
    this.description = "all lights give out eventually"
    this.allowDuplicates = false
    this.processOnlyOnActorTurn = true
    this.lifespan = -1
    this.renderer = {
      color: COLORS.sunset,
      background: COLORS.black,
      character: 'o'
    }


    this.onStep = (timePassed) => {
      if (!this.actor.entityTypes.includes('ILLUMINATING')) return

      if (this.actor.lightRange > 1) this.actor.decrementLightRange()
    }
  }
}