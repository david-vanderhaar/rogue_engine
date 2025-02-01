import { StatLeechAttack } from './StatLeechAttack';

export class StatChakraLeechAttack extends StatLeechAttack {
  constructor({...args}) {
    super({ ...args });
    this.statAttributePath = 'charge'
    this.statAttributePathMax = 'chargeMax'
    this.statAttributeValueMin = 0
  }
}

