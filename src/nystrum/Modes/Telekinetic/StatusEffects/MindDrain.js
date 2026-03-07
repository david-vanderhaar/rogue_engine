import ConstantStatChange from '../../../StatusEffects/ConstantStatChange';
import { COLORS } from '../theme';

export class MindDrain extends ConstantStatChange {
  constructor({...args}) {
    super({ ...args });
    this.name = 'Mind drain';
    this.description = "your mind is being drained from effort"
    this.lifespan = -1
    this.renderer = {
      color: COLORS.blue_light,
      background: COLORS.black,
      character: 'm'
    }
    this.statAttributePath = 'charge'
    this.statAttributePathMax = 'chargeMax'
    this.changeByValue = -1
    this.statAttributeValueMin = 0
  }
}
