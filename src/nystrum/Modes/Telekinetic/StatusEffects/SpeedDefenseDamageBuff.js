import {Base} from '../../../StatusEffects/Base';
import { CARDINAL_DIRECTIONS, ENERGY_THRESHOLD } from '../../../constants';
import { MoveOrAttack } from '../../../Actions/MoveOrAttack';
import * as Helper from '../../../../helper';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter'
import { COLORS } from '../theme';

export class SpeedDefenseDamageBuff extends Base {
  constructor({
    speedBuff = 0,
    defenseBuff = 0,
    damageBuff = 0,
    chargeCostPerTurn = 1,
    ...args
  }) {
    super({ ...args });
    this.allowDuplicates = false
    this.processOnlyOnActorTurn = true
    // this.lifespan = -1

    let background = COLORS.white
    if (speedBuff > 0) background = '#ff9926'
    if (damageBuff > 0) background = COLORS.red
    if (defenseBuff > 0) background = COLORS.blue

    this.renderer = {
      character: '〣',
      sprite: '〣',
      // color: COLORS.light,
      color: background,
      background: COLORS.dark_accent,
    }

    this.onStart = () => {
      this['actor_background'] = this.actor.renderer.background;
      this['actor_color'] = this.actor.renderer.color;
      this.actor.renderer.background = background
      this.actor.renderer.color = COLORS.white

      this.actor.speed += speedBuff * ENERGY_THRESHOLD;
      this.actor.defense += defenseBuff;
      this.actor.attackDamage += damageBuff;

      let buffName = ''
      if (speedBuff > 0) buffName = 'speed'
      if (damageBuff > 0) buffName = 'damage'
      if (defenseBuff > 0) buffName = 'defense'

      this.game.addMessage(`${this.actor.name} uses mind to buff ${buffName}`, {color: this.renderer.color, backgroundColor: this.renderer.background})
    }

    this.onStop = () => {
      this.actor.renderer.background = this['actor_background'];
      this.actor.renderer.color = this['actor_color'];
      this.actor.speed -= speedBuff * ENERGY_THRESHOLD;
      this.actor.defense -= defenseBuff;
      this.actor.attackDamage -= damageBuff;
      this.game.addMessage(`${this.actor.name}\'s mind is exhausted.`, {color: this.renderer.color, backgroundColor: this.renderer.background})
    }

    this.onStep = (timePassed) => {
      console.log('step: ', timePassed);
      
      // random chance to move in a random direction
      // const direction = CARDINAL_DIRECTIONS[Helper.getRandomInArray(Object.keys(CARDINAL_DIRECTIONS))];
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

      // this.actor.decreaseCharge(1)
      // if (this.actor.charge <= 0) this.remove()
    }
  }
}