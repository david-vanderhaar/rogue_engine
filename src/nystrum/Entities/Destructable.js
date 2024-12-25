import { destroyActor } from './helper';
import * as Helper from '../../helper';
import { ANIMATION_TYPES } from '../Display/konvaCustom';
import spatterEmitter from '../Engine/Particle/Emitters/spatterEmitter';
import { MESSAGE_TYPE } from '../message';

export const Destructable = superclass => class extends superclass {
  constructor({ durability = 1, defense = 0, onDestroy = () => null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('DESTRUCTABLE');
    this.durability = durability;
    this.durabilityMax = durability;
    this.defense = defense;
    this.onDestroy = onDestroy;
    this.actorSprite = this.renderer.sprite
    this.actorCharacter = this.renderer.character
  }
  getDefense() {
    let defense = this.defense;
    // add in reducer to get defense stats of all equpiment
    if (this.entityTypes.includes('EQUIPING')) {
      this.equipment.forEach((slot) => {
        if (slot.item) {
          if (slot.item.entityTypes.includes('DESTRUCTABLE')) {
            defense += slot.item.getDefense();
          }
        }
      });
    }
    return defense;
  }
  decreaseDurabilityWithoutDefense(value) {
    this.durability -= value;
    if (this.durability <= 0) {
      this.destroy();
    }
  }
  decreaseDurability(value) {
    const current = this.durability;
    const defense = this.getDefense()
    const decreaseBy = value - defense
    const newDurability = current - decreaseBy;
    this.durability = Math.min(current, newDurability);
    this.addDurabilityChangeAnimation(-decreaseBy)
    this.addDefenseAppliedAnimation(defense)
    this.addDecreaseDurabilityMessage(decreaseBy, defense)
    this.updateActorRenderer();
    if (this.entityTypes.includes('PLAYING')) this.bloodSpatter(value)
    if (this.durability <= 0) {
      this.destroy();
    }
  }

  addDecreaseDurabilityMessage(decreaseBy, defendFor) {
    if (defendFor <= 0) return;
    this.game.addMessage(`${this.name} blocks ${defendFor} of ${decreaseBy} damage`, MESSAGE_TYPE.INFORMATION);
  }

  bloodSpatter(value) {
    spatterEmitter({
      game: this.game,
      fromPosition: this.getPosition(),
      spatterAmount: .2 * value,
      spatterRadius: 3,
      // spatterDirection: Helper.getDirectionFromOrigin(this.actor.getPosition(), this.targetPos),
      transfersBackground: true,
      spatterColors: ['#833139', '#aa2123'],
    }).start()
  }

  shakePlayer() {
    const nodeKey = Helper.coordsToString(this.getPosition()) // needs to be relative rendered position
    const actorNode = this.game.tileMap[nodeKey]
    this.game.display.shakeNode({node: actorNode, intensity: 2})
  }
  increaseDurability(value) {
    this.durability += value;
    this.addDurabilityChangeAnimation(+value)
    this.updateActorRenderer();
  }
  updateActorRenderer() {
    if (this.durability === this.durabilityMax) {
      this.renderer.sprite = this.actorSprite;
      this.renderer.character = this.actorCharacter;
    } else {
      this.renderer.sprite = this.durability;
      this.renderer.character = this.durability;
    }
    this.game.draw();
  }

  addDurabilityChangeAnimation(value) {
    let sign = ''
    let color = '#dc322f'

    if (value > 0) {
      sign = '+'
      color = '#3e7dc9'
    }

    const text = sign + value
    this.animateText(text, color)
  }

  addDefenseAppliedAnimation(value) {
    // don't show defense if none is applied
    if (value <= 0) return;
    this.animateText(`block ${value}`, '#eee')
  }

  animateText(text, color) {
    this.game.display.addAnimation(
      ANIMATION_TYPES.TEXT_FLOAT,
      {
        ...this.getPosition(),
        color,
        text,
        timeToLive: 750,
      }
    );
  }

  destroy() {
    this.onDestroy(this);
    destroyActor(this);
  }
};
