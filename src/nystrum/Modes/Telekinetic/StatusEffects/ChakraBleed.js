import ConstantStatChange from '../../../StatusEffects/ConstantStatChange';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../HiddenLeaf/theme';

export class ChakraBleed extends ConstantStatChange {
  constructor({...args}) {
    super({ ...args });
    this.name = 'chakra bleed';
    this.description = "chakra is being drained"
    this.lifespan = -1
    this.renderer = {
      color: HIDDEN_LEAF_COLORS.chakra,
      background: HIDDEN_LEAF_COLORS.black,
      character: 'o'
    }
    this.statAttributePath = 'charge'
    this.statAttributePathMax = 'chargeMax'
    this.changeByValue = -1
    this.statAttributeValueMin = 0
  }
}
