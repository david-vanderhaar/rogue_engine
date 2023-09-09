import {Base} from '../../../StatusEffects/Base';
import { COLORS } from '../theme';

export class FearOfDark extends Base {
  constructor({...args}) {
    super({ ...args });
    this.name = 'fear of the dark';
    this.description = "your hands cramp and shake, you can't hold steady. you\'re losing you\'re mind. where is the light?"
    this.allowDuplicates = false
    this.processOnlyOnPlayerTurn = true
    this.lifespan = -1
    this.renderer = {
      color: COLORS.green,
      background: COLORS.black,
      character: 'x'
    }


    this.onStep = (timePassed) => {
      if (!this.actor.entityTypes.includes('FEARFUL')) return

      this.actor.setFearByLightStrength()
    }
  }
}