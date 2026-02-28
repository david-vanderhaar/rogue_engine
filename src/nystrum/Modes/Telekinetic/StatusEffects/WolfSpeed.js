import { ENERGY_THRESHOLD } from '../../../constants';
import { COLORS as HIDDEN_LEAF_COLORS } from '../theme';
import { Base } from '../../../StatusEffects/Base';
import { MESSAGE_TYPE } from '../../../message';

export class WolfSpeed extends Base {
  constructor({speedBuff = ENERGY_THRESHOLD * 2, damageBuff = 2, ...args}) {
    super({ ...args });
    this.name = 'Wolf Speed';
    this.description = "Channeling the ferocity of wolves to enhance speed and power!"
    this.allowDuplicates = false
    this.processOnlyOnActorTurn = true
    this.speedBuff = speedBuff
    this.damageBuff = damageBuff
    this.renderer = {
      color: HIDDEN_LEAF_COLORS.kiba,
      background: HIDDEN_LEAF_COLORS.kiba_alt,
      character: '〣'
    }

    this.onStart = () => {
      this.actor.speed += this.speedBuff;
      this.actor.attackDamage += this.damageBuff;
      this.actor.energy += this.speedBuff;
      this.actor.renderer.character = '〣'
      this.actor.renderer.color = HIDDEN_LEAF_COLORS.kiba;
      this.actor.renderer.background = HIDDEN_LEAF_COLORS.kiba_alt;
      this.game.addMessage(`${this.actor.name} unleashes their wild instincts!`, MESSAGE_TYPE.ACTION);
    }
    
    this.onStop = () => {
      this.actor.speed -= this.speedBuff;
      this.actor.attackDamage -= this.damageBuff;
      this.actor.renderer.character = 'K'
      this.actor.renderer.color = HIDDEN_LEAF_COLORS.kiba_alt;
      this.actor.renderer.background = HIDDEN_LEAF_COLORS.kiba;
      this.game.addMessage(`${this.actor.name}'s wild instincts subside.`, MESSAGE_TYPE.ACTION);
    }
  }
}
