import {Base} from '../../../StatusEffects/Base';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter'
import { COLORS as HIDDEN_LEAF_COLORS } from '../../HiddenLeaf/theme';

export class Sharingan extends Base {
  constructor({speedBuff = 0, damageBuff = 0, chakraCost = 1, ...args}) {
    super({ ...args });
    this.name = 'activate your birthright, your clan\'s kekkei genkai, the sharingan.';
    this.description = "at the cost of your chakra, you can see your opponent's moves."
    this.allowDuplicates = false
    this.processOnlyOnActorTurn = true
    this.lifespan = -1
    this['actor_background'] = this.actor.renderer.background;
    this['actor_color'] = this.actor.renderer.color;
    this['actor_inialize_keymap'] = this.actor.initializeKeymap
    this.renderer = {
      color: HIDDEN_LEAF_COLORS.black,
      background: HIDDEN_LEAF_COLORS.sasuke_alt,
      character: '✦️',
    }

    this.onStart = () => {
      this.actor.renderer.background = this['actor_color']
      this.actor.renderer.color = this['actor_background']
      this.actor.speed += speedBuff;
      this.actor.energy += speedBuff;
      this.actor.attackDamage += damageBuff;
      this.game.addMessage(`${this.actor.name} activated the sharingan`, {color: this.renderer.color, backgroundColor: this.renderer.background})

      // get enemy
      const opp = this.game.mode.getTournamentOpponent().initialize(this.game.engine)
      // swap keymaps
      this.actor.initializeKeymap = opp.initializeKeymap
      this.actor.reinitializeKeymap()
    }

    this.onStop = () => {
      this.actor.renderer.color = this['actor_color']
      this.actor.renderer.background = this['actor_background']
      this.actor.speed -= speedBuff;
      this.actor.attackDamage -= damageBuff;
      this.game.addMessage(`${this.actor.name} deactivated the sharingan`, {color: this.renderer.color, backgroundColor: this.renderer.background})

      this.actor.initializeKeymap = this['actor_inialize_keymap']
      this.actor.reinitializeKeymap()
    }

    this.onStep = (timePassed) => {
      SpatterEmitter({
        game: this.game,
        fromPosition: this.actor.getPosition(),
        spatterAmount: .1,
        spatterRadius: 3,
        animationTimeStep: 0.9,
        transfersBackground: false,
        spatterColors: [HIDDEN_LEAF_COLORS.sasuke_alt, HIDDEN_LEAF_COLORS.sasuke],
      }).start()

      this.actor.decreaseCharge(chakraCost)
      if (this.actor.charge <= 0) this.remove()
    }
  }
}