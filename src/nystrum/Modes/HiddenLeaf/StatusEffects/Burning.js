import { EASING } from '../../../../helper';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter';
import ConstantStatChange from '../../../StatusEffects/ConstantStatChange';
import { COLORS as HIDDEN_LEAF_COLORS } from '../theme';

export class Burning extends ConstantStatChange {
  constructor({...args}) {
    super({ ...args });
    this.name = 'burning';
    this.description = "you are burning."
    this.allowDuplicates = false
    this.lifespan = 200
    this.timeToLive = this.lifespan
    this.statAttributeDecreaseFunction = 'decreaseDurabilityWithoutDefense'
    this.changeByValue = 1
    this.renderer = {
      color: HIDDEN_LEAF_COLORS.yellow,
      background: HIDDEN_LEAF_COLORS.red,
      character: 'x'
    }
  }

  start() {
    super.start()
    console.log('Burning: onStart');
    console.log(this.timeToLive, this.lifespan);
    
    
    this['particle_interval'] = setInterval(() => {
      SpatterEmitter({
        game: this.game,
        fromPosition: this.actor.getPosition(),
        spatterAmount: .2,
        spatterRadius: 2,
        animationTimeStep: 0.9,
        easeingFunction: EASING.easeOutCubic,
        transfersBackground: false,
        spatterColors: [HIDDEN_LEAF_COLORS.red, HIDDEN_LEAF_COLORS.yellow],
      }).start()
    }, 600)
  }
  
  stop() {
    super.stop()
    console.log('Burning: onStop');
    clearInterval(this['particle_interval'])
  }
}
