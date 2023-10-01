import {Base} from './Base';
import {MESSAGE_TYPE} from '../message';
import * as Helper from '../../helper';
import SpatterEmitter from '../Engine/Particle/Emitters/spatterEmitter'

export class OpenGates extends Base {
  constructor({...args}) {
    super({ ...args });
    this.lifespan = -1;
    this.allowDuplicates = false
    this['actor_background'] = this.actor.renderer.background;
    const nextGate = this.actor.getNextGate();
    this.name = nextGate.name;
    this.renderer = {
      background: '#3cc2bb',
      color: '#24fe88',
      character: nextGate?.character || '0',
    }
    this.onStart = () => {
      const nextGate = this.actor.setNextGate();
      this.actor.speed += nextGate.buffValue;
      this.actor.energy += nextGate.buffValue;
      this.actor.attackDamage += nextGate.damageBuff;
      this.actor.renderer.character = nextGate.character;
      this.game.addMessage(`${this.actor.name} opened the ${nextGate.name}.`);
      this.actor.decreaseDurability(nextGate.durabilityDebuff);
      this.actor.decreaseDurability(0);
      this.game.addMessage(`${this.actor.name} suffers ${nextGate.durabilityDebuff} damage from physical stress.`)
      const currentGateLevel = this.actor.getCurrentGateLevel();
      SpatterEmitter({
        game: this.game,
        fromPosition: this.actor.getPosition(),
        spatterAmount: (currentGateLevel + 3) / 10,
        spatterRadius: Math.max(3, currentGateLevel * 2),
        animationTimeStep: 0.6,
        // spatterDirection: Helper.getDirectionFromOrigin(actor.getPosition(), targetPos),
        transfersBackground: false,
        spatterColors: [this.renderer.color, this.renderer.background],
      }).start()
    }
  }
  
  static displayName = 'Open Inner Gates'
  static getValidTargetsOnTile(tile, actor) {
    return Helper.getDestructableEntities(tile.entities).filter((entity) => actor.id !== entity.id && actor.isAlly(entity));
  }
}
