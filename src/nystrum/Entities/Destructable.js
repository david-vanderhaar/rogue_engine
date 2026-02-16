import { destroyActor } from './helper';
import * as Helper from '../../helper';
import { ANIMATION_TYPES } from '../Display/konvaCustom';
import spatterEmitter from '../Engine/Particle/Emitters/spatterEmitter';
import { MESSAGE_TYPE } from '../message';
import { GLOBAL_EVENT_BUS } from '../Events/EventBus';

export const Destructable = superclass => class extends superclass {
  constructor({
    durability = 1,
    defense = 0,
    onDestroy = () => null,
    onDecreaseDurability = () => null,
    ...args
  }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('DESTRUCTABLE');
    this.durability = durability;
    this.durabilityMax = durability;
    this.defense = defense;
    this.onDestroy = onDestroy;
    this.onDecreaseDurability = onDecreaseDurability;
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
    } else {
      this.onDecreaseDurability()
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
    this.portraitFlash()
    // this.shakePlayer()
    if (this.entityTypes.includes('PLAYING')) this.bloodSpatter(value)
    if (this.durability <= 0) {
      this.destroy();
    } else {
      this.onDecreaseDurability()
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

  portraitFlash() {
    const portrait = this.renderer?.basePortrait
    const altPortrait = this.renderer?.damageFlashPortrait

    if (!portrait || !altPortrait) return; // don't flash if character doesn't have portrait;

    const ports = [portrait, altPortrait]
    let port_index = 0

    function switch_port() {
      port_index = 1 - port_index
      const new_port = ports[port_index]
      
      return new_port
    }

    const flashInterval = 50; // Time between flashes in milliseconds
    const flashCount = 12; // Total number of flashes

    let flashStep = 0;
    const flashEffect = setInterval(() => {
      this.renderer.portrait = switch_port(); // Switch the portrait
      this.game.updateReact(this.game);

      flashStep++;
      if (flashStep >= flashCount) {
        clearInterval(flashEffect); // Stop flashing after completing cycles
      }
    }, flashInterval);
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

  sendDestroyGameEvents() {
    // a hack to ensrue destroy event is emitted after all other events (like attack events) have been processed
    setTimeout(() => {
      GLOBAL_EVENT_BUS.emit(`${this.id}:destroy`, { message: `${this.name} was destroyed!` });
    }, 100)
  }

  destroy() {
    this.sendDestroyGameEvents();
    this.onDestroy(this);
    destroyActor(this);
  }
};
