import { ENERGY_THRESHOLD } from '../../../constants';
import {Base} from '../../../StatusEffects/Base';

export class RemoveWeights extends Base {
  constructor({speedBuff = ENERGY_THRESHOLD * 2, damageBuff = -1, ...args}) {
    super({ ...args });
    this.name = 'Removed weights';
    this.description = "the weights are off, let's go!"
    this.allowDuplicates = false
    this.processOnlyOnPlayerTurn = true
    this.speedBuff = speedBuff
    this.damageBuff = damageBuff
    this.renderer = {
      color: '#424242',
      background: '#e6e6e6',
      character: '〣'
    }

    this.onStart = () => {
      this.actor.speed += this.speedBuff;
      this.actor.attackDamage = Math.max(0, this.actor.attackDamage + this.damageBuff);
      this.actor.energy += this.speedBuff;
      this.actor.renderer.character = '〣'
      console.log(`${this.actor.name} removed weighted wraps.`);
    }
    
    this.onStop = () => {
      this.actor.speed -= this.speedBuff;
      this.actor.attackDamage += this.damageBuff;
      this.actor.renderer.character = 'R'
      console.log(`${this.actor.name} rewrapped weights.`);
    }
  }
}
