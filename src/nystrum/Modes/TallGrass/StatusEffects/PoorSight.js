import { ENERGY_THRESHOLD } from '../../../constants';
import {Base} from '../../../StatusEffects/Base';
import { COLORS } from '../theme';

export class PoorSight extends Base {
  constructor({...args}) {
    super({ ...args });
    this.name = 'poor sight';
    this.description = "you can't see it, but it's there."
    this.allowDuplicates = false
    this.processOnlyOnPlayerTurn = true
    this.renderer = {
      color: COLORS.white,
      background: COLORS.black,
      character: 'r'
    }

    this.onStart = () => {
      this.actor.baseRangedAccuracy = -1 * (this.actor.fearPoints / this.actor.maxFearPoints)
    }

    this.onStep = () => {
      this.actor.baseRangedAccuracy = -1 * (this.actor.fearPoints / this.actor.maxFearPoints)
    }
    
    this.onStop = () => {
      this.actor.baseRangedAccuracy = 0
    }
  }
}