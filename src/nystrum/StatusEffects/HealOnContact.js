import {Base} from './Base';
import * as Helper from '../../helper';
import { COLORS } from '../Modes/Jacinto/theme';
import SOUNDS from '../sounds';
import { MESSAGE_TYPE } from '../message';

export class HealOnContact extends Base {
  constructor({value = 1, useCount = 3, messageOnDamage = null, messageType = MESSAGE_TYPE.DANGER, ...args}) {
    super({ ...args });
    this.name = 'healing properties';
    this.allowDuplicates = false
    this.timeToLive = Infinity;
    this.renderer = {
      color: COLORS.red,
      background: COLORS.blue,
      character: '+'
    };
    this.messageOnDamage = messageOnDamage
    this.messageType = messageType
    this.value = value
    this.uses = useCount
    this.onStep = this.handleStep
  }

  handleStep () {
    const pos = this.actor.getPosition()
    if (hasNotBeenPlaced(pos)) return;
    const enemies = this.getEnemiesAtCurrentPosition();
    if (enemies.length == 0) return;
    enemies[0].increaseDurability(this.value)
    this.uses -=1
    this.playSound()
    this.displayMessage()
    if (this.uses <= 0) {
      this.actor.destroy()
      this.playDestroyedSound()
    }
  }

  displayMessage() {
    if (!this.messageOnDamage) return
    this.actor.game.addMessage(this.messageOnDamage, this.messageType);
  }

  playSound() {
    SOUNDS.save.play();
  }

  playDestroyedSound() {
    SOUNDS.grab_0.play();
  }

  getEnemiesAtCurrentPosition() {
    const tile = Helper.getTileAtPosition(this.game, this.actor.getPosition())
    if (!tile) return [];
    return Helper.getDestructableEntities(tile.entities).filter((entity) => this.actor.id !== entity.id && this.actor.isEnemy(entity));
  }

  static displayName = 'strange juice'
}

const hasNotBeenPlaced = (pos) => Helper.coordsAreEqual({x: 0, y: 0}, pos)