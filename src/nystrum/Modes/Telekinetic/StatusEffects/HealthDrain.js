import ConstantStatChange from '../../../StatusEffects/ConstantStatChange';
import { COLORS } from '../theme';

export class HealthDrain extends ConstantStatChange {
  constructor({...args}) {
    super({ ...args });
    this.name = 'Bleed';
    this.description = "you are bleeding and life is slipping away."
    this.lifespan = -1
    this.renderer = {
      color: COLORS.red,
      background: COLORS.black,
      character: 'b'
    }
    this.statAttributePath = 'durability'
    this.statAttributePathMax = 'durabilityMax'
    this.statAttributeValueMin = 0
    this.statAttributeDecreaseFunction = 'decreaseDurabilityWithoutDefense'
  }
}
