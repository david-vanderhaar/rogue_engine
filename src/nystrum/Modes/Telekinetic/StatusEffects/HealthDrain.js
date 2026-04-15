import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter';
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

  step(timePassed) {
    super.step(timePassed)
    let chance = Math.random();
    if (chance > 0.2) SpatterEmitter({
      game: this.game,
      fromPosition: this.actor.getPosition(),
      spatterAmount: .5,
      spatterRadius: 1,
      animationTimeStep: 0.9,
      // spatterDirection: { x: direction[0], y: direction[1] },
      spatterDirection: { x: 0, y: 0 },
      transfersBackground: false,
      spatterColors: [this.renderer.color, this.renderer.background]
    }).start()
  }
}
