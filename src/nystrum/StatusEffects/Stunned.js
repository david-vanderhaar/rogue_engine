import {Base} from './Base.js'
import * as Helper from '../../helper.js'
import {ANIMATION_TYPES} from '../Display/konvaCustom.js'

export default class Stunned extends Base {
  constructor({
    turnsStunned = 1,
    ...args
  }) {
    super({ ...args });
    this.name = 'stunned';
    this.description = "cannot move or act"
    this.allowDuplicates = false
    this.processOnlyOnActorTurn = true
    this.lifespan = -1
    this.stepInterval = 0
    this.turnsStunned = turnsStunned
  }

  step(timePassed) {
    console.log('stunned step ', this.turnsStunned, timePassed);
    
    super.step(timePassed)
    if (this.turnsStunned > 0) {
      // this.actor.energy = 0
      this.actor.skipTurn = true
      this.turnsStunned -= 1
      this.addChangeAnimation()
    } else {
      // this.actor.energy = this.actor.speed
      this.actor.skipTurn = false
      this.remove()
    }
  }

  addChangeAnimation() {
    const text = 'turn skipped'
    this.animateText(text, this.renderer.color)
  }

  animateText(text, color) {
    this.game.display.addAnimation(
      ANIMATION_TYPES.TEXT_FLOAT,
      {
        ...this.actor.getPosition(),
        color,
        text,
        timeToLive: 750,
      }
    );
  }
}