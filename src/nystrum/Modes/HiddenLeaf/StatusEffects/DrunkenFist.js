import {Base} from '../../../StatusEffects/Base';
import { CARDINAL_DIRECTIONS, ENERGY_THRESHOLD } from '../../../constants';
import { MoveOrAttack } from '../../../Actions/MoveOrAttack';
import * as Helper from '../../../../helper';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter'

export class DrunkenFist extends Base {
  constructor({speedBuff = -1, damageBuff = 2, ...args}) {
    super({ ...args });
    this.name = 'enter the drunken fist';
    this.description = "you're drunk, but you're also a master of the drunken fist. there is power in those wild movements."
    this.allowDuplicates = false
    this.processOnlyOnActorTurn = true
    this.renderer = {
      color: '#c45ffd',
      background: '#424242',
      character: '?'
    }

    this.onStart = () => {
      this.actor.speed += speedBuff;
      this.actor.attackDamage += damageBuff;
      this.game.addMessage(`${this.actor.name} entered the drunken fist`, {color: this.renderer.color, backgroundColor: this.renderer.background})
    }

    this.onStop = () => {
      this.actor.speed -= speedBuff;
      this.actor.attackDamage -= damageBuff;
      this.game.addMessage(`${this.actor.name} sobered up`, {color: this.renderer.color, backgroundColor: this.renderer.background})
    }

    this.onStep = (timePassed) => {
      // random chance to move in a random direction
      let chance = Math.random();
      if (chance > 0.5) return
      const direction = CARDINAL_DIRECTIONS[Helper.getRandomInArray(Object.keys(CARDINAL_DIRECTIONS))];
      const actor = this.actor;
      const newX = actor.pos.x + direction[0];
      const newY = actor.pos.y + direction[1];
      const targetPos = { x: newX, y: newY };
      actor.setNextAction(new MoveOrAttack({
        targetPos,
        game: this.game,
        actor,
        energyCost: 0
      }))
      SpatterEmitter({
        game: this.game,
        fromPosition: targetPos,
        spatterAmount: .1,
        spatterRadius: 6,
        animationTimeStep: 0.9,
        spatterDirection: Helper.getDirectionFromOrigin(actor.getPosition(), targetPos),
        transfersBackground: false,
        spatterColors: ['#c45ffd', '#424242'],
      }).start()

    }
  }
}