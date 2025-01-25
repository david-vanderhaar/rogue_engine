import {Base} from '../../../StatusEffects/Base';
import { CARDINAL_DIRECTIONS, ENERGY_THRESHOLD } from '../../../constants';
import { MoveOrAttack } from '../../../Actions/MoveOrAttack';
import * as Helper from '../../../../helper';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter'
import { COLORS } from '../theme';

export class WindBursts extends Base {
  constructor({speedBuff = ENERGY_THRESHOLD, defenseBuff = 1, ...args}) {
    super({ ...args });
    this.name = 'wind bursts';
    this.description = "summon short bursts of wind to speed up your movements and deflect attacks."
    this.allowDuplicates = false
    this.processOnlyOnPlayerTurn = true
    this.lifespan = -1
    this.renderer = {
      character: '〣',
      sprite: '〣',
      color: COLORS.wraps,
      background: COLORS.temari,
    }

    this.onStart = () => {
      this.actor.speed += speedBuff;
      this.actor.defense += defenseBuff;
      this.game.addMessage(`${this.actor.name} summoned a wind guard`, {color: this.renderer.color, backgroundColor: this.renderer.background})
    }

    this.onStop = () => {
      this.actor.speed -= speedBuff;
      this.actor.defense -= defenseBuff;
      this.game.addMessage(`${this.actor.name} wind guard has been dispelled`, {color: this.renderer.color, backgroundColor: this.renderer.background})
    }

    this.onStep = (timePassed) => {
      // random chance to move in a random direction
      const direction = CARDINAL_DIRECTIONS[Helper.getRandomInArray(Object.keys(CARDINAL_DIRECTIONS))];
      let chance = Math.random();
      if (chance > 0.5) SpatterEmitter({
        game: this.game,
        fromPosition: this.actor.getPosition(),
        spatterAmount: .1,
        spatterRadius: 3,
        animationTimeStep: 0.9,
        // spatterDirection: { x: direction[0], y: direction[1] },
        spatterDirection: { x: 0, y: 0 },
        transfersBackground: false,
        spatterColors: [this.renderer.color, this.renderer.background]
      }).start()

      this.actor.decreaseCharge(1)
      if (this.actor.charge <= 0) this.remove()
    }
  }
}