import {Base} from '../../../StatusEffects/Base';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter'
import { COLORS as HIDDEN_LEAF_COLORS } from '../../HiddenLeaf/theme';
import * as Constant from '../../../constants';
import { EASING } from '../../../../helper';
import { MoveOrAttack } from '../../../Actions/MoveOrAttack';
import { PrepareDirectionalThrow } from '../../../Actions/PrepareDirectionalThrow';
import { ChakraResource } from '../../../Actions/ActionResources/ChakraResource';
import { Grenade } from '../../../Items/Weapons/Grenade';
import { ContainerSlot } from '../../../Entities/Containing';
import { remove } from 'lodash';

export class NineTailsBeastMode extends Base {
  constructor({speedBuff = 200, damageBuff = 1, chakraBuff = 9, lifeCost = 1, ...args}) {
    super({ ...args });
    this.name = 'Nine Tails Beast Mode';
    this.description = "tap into the endless chakra of the nine tails at the cost of your life force"
    this.allowDuplicates = false
    this.processOnlyOnPlayerTurn = true
    // this.lifespan = 1000
    this['actor_background'] = this.actor.renderer.background;
    this['actor_color'] = this.actor.renderer.color;
    this['actor_inialize_keymap'] = this.actor.initializeKeymap
    this.renderer = {
      color: HIDDEN_LEAF_COLORS.black,
      background: HIDDEN_LEAF_COLORS.red,
      character: '✦️',
    }

    this.onStart = () => {
      this.actor.renderer.color = HIDDEN_LEAF_COLORS.black
      this.actor.renderer.background = HIDDEN_LEAF_COLORS.red
      this.actor.renderer.character = '〣'
      this.actor.renderer.sprite = '〣'
      this.actor.speed += speedBuff;
      this.actor.energy += speedBuff;
      this.actor.chargeMax += chakraBuff;
      this.actor.increaseCharge(chakraBuff);
      this.actor.attackDamage += damageBuff;
      // this.actor.durability = 1
      this.game.addMessage(`${this.actor.name} unleashed the nine tails `, {color: this.renderer.color, backgroundColor: this.renderer.background})

      // swap keymaps
      this.actor.initializeKeymap = nineTailsKeymap
      this.actor.reinitializeKeymap()

      addBeastBombs(this.game.engine, this.actor)

      this['particle_interval'] = setInterval(() => {
        SpatterEmitter({
          game: this.game,
          fromPosition: this.actor.getPosition(),
          spatterAmount: .4,
          spatterRadius: 2,
          animationTimeStep: 0.9,
          easeingFunction: EASING.easeOutCubic,
          transfersBackground: false,
          spatterColors: [HIDDEN_LEAF_COLORS.wall, HIDDEN_LEAF_COLORS.red, HIDDEN_LEAF_COLORS.black],
        }).start()
      }, 300)
    }

    this.onStop = () => {
      this.actor.renderer.color = this['actor_color']
      this.actor.renderer.background = this['actor_background']
      this.actor.renderer.character = 'N'
      this.actor.renderer.sprite = 'N'
      this.actor.speed -= speedBuff;
      this.actor.attackDamage -= damageBuff;
      this.actor.chargeMax -= chakraBuff;
      // this.actor.decreaseCharge(chakraBuff);
      this.game.addMessage(`${this.actor.name} sealed the nine tails`, {color: this.renderer.color, backgroundColor: this.renderer.background})

      clearInterval(this['particle_interval'])

      this.actor.initializeKeymap = this['actor_inialize_keymap']
      this.actor.reinitializeKeymap()

      removeBeastBombs(this.actor)
    }

    this.onStep = (timePassed) => {
      // this.actor.decreaseDurability(lifeCost)
      // console.log(this.actor.durability);
      // if (this.actor.durability <= 1) this.remove()
    }
  }
}

function addBeastBombs (engine, actor) {
  const grenades = Array(100).fill('').map(() => Grenade(engine, 8, 3));
  const slot = new ContainerSlot({
    itemType: grenades[0].name,
    items: grenades,
  })

  actor.container.push(slot)
}

function removeBeastBombs (actor) {
  actor.container = actor.container.filter((slot) => slot.itemType !== 'Grenade')
}

const nineTailsKeymap = (engine, actor) => {
  return {
    'w,ArrowUp': () => {
      const direction = Constant.DIRECTIONS.N;
      let newX = actor.pos.x + direction[0];
      let newY = actor.pos.y + direction[1];
      return new MoveOrAttack({
        hidden: true,
        targetPos: { x: newX, y: newY },
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD
      });
    },
    's,ArrowDown': () => {
      const direction = Constant.DIRECTIONS.S;
      let newX = actor.pos.x + direction[0];
      let newY = actor.pos.y + direction[1];
      return new MoveOrAttack({
        hidden: true,
        targetPos: { x: newX, y: newY },
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD
      });
    },
    'a,ArrowLeft': () => {
      const direction = Constant.DIRECTIONS.W;
      let newX = actor.pos.x + direction[0];
      let newY = actor.pos.y + direction[1];
      return new MoveOrAttack({
        hidden: true,
        targetPos: { x: newX, y: newY },
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD
      });
    },
    'd,ArrowRight': () => {
      const direction = Constant.DIRECTIONS.E;
      let newX = actor.pos.x + direction[0];
      let newY = actor.pos.y + direction[1];
      return new MoveOrAttack({
        hidden: true,
        targetPos: { x: newX, y: newY },
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD
      });
    },
    t: () => new PrepareDirectionalThrow({
      label: 'Beast Bomb',
      projectileType: 'Grenade',
      game: engine.game,
      actor,
      passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 3 })]
    })
  };
}
