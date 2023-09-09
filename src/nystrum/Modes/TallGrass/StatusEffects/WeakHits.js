import { ENERGY_THRESHOLD } from '../../../constants';
import {Base} from '../../../StatusEffects/Base';
import { COLORS } from '../theme';

export class WeakHits extends Base {
  constructor({...args}) {
    super({ ...args });
    this.name = 'weak hits';
    this.description = "you are losing your will to even strike back"
    this.allowDuplicates = false
    this.processOnlyOnPlayerTurn = true
    this.renderer = {
      color: COLORS.flesh2,
      background: COLORS.flesh3,
      character: 'm'
    }

    this.onStart = () => {
      this.actor.attackDamage = 0
    }
    
    this.onStop = () => {
      this.actor.attackDamage = 1
    }
  }
}