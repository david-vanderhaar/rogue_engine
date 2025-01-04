import { getTileAtPosition, EASING } from '../../../../helper';
import { ENERGY_THRESHOLD } from '../../../constants';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter';
import {Base} from '../../../StatusEffects/Base';
import { ChakraBleed } from './ChakraBleed';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../HiddenLeaf/theme';

export class WalkingOnWater extends Base {
  constructor({...args}) {
    super({ ...args });
    this.name = 'walking on water';
    this.description = "you are walking on water."
    this.allowDuplicates = false
    this.lifespan = -1
    this.renderer = {
      color: '#424242',
      background: '#e6e6e6',
      character: '〣'
    }

    this.onStart = () => {
      // add chakra bleed effect
      const effect = new ChakraBleed({
        game: this.game,
        actor: this.actor,
        stepInterval: ENERGY_THRESHOLD
      })
      this['chakraBleedEffect'] = effect
      this.game.engine.addStatusEffect(effect);

      this['particle_interval'] = setInterval(() => {
        SpatterEmitter({
          game: this.game,
          fromPosition: this.actor.getPosition(),
          spatterAmount: .2,
          spatterRadius: 2,
          animationTimeStep: 0.9,
          easeingFunction: EASING.easeOutCubic,
          transfersBackground: false,
          spatterColors: [HIDDEN_LEAF_COLORS.chakra, HIDDEN_LEAF_COLORS.black],
        }).start()
      }, 600)
    }
    
    this.onStop = () => {
      clearInterval(this['particle_interval'])
    }

    this.onStep = (timePassed) => {
      if (!this.actor.traversableTiles.includes('WATER')) {
        this.actor.traversableTiles.push('WATER')
      }
      
      if (this.actor.charge < 1) {
        this.actor.traversableTiles = this.actor.traversableTiles.filter((type) => type !== 'WATER')
      }

      const tile = getTileAtPosition(this.game, this.actor.getPosition())
      if (tile.type !== 'WATER') {
        this['chakraBleedEffect'].remove()
        if (!this.actor.traversableTiles.includes('WATER')) {
          this.actor.traversableTiles.push('WATER')
        }
        this.remove()
      }
    }
  }
}
