import { clamp } from "../../helper";
import { JACINTO_SOUNDS } from "../Modes/Jacinto/sounds";
import { LightDrain } from "../Modes/TallGrass/StatusEffects/LightDrain";

export const Illuminating = superclass => class extends superclass {
  constructor({ lightRange = 8, lightColor = '#f9d091', lightDrain = true, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('ILLUMINATING');
    this.lightRange = lightRange
    this.lightColor = lightColor
    this.lightDrain = lightDrain
    if (lightDrain) this.initializeDrainEffect()
  }

  setLightRange(value) {
    this.lightRange = clamp(value, 0, 10)
  }

  incrementLightRange(amount = 1) {
    this.setLightRange(this.lightRange + amount)
    JACINTO_SOUNDS.light_up.play()
  }

  decrementLightRange(amount = 1) {
    this.setLightRange(this.lightRange - amount)
    JACINTO_SOUNDS.light_drain.play()
  }

  initializeDrainEffect() {
    const effect = new LightDrain({
      game: this.game,
      actor: this,
      stepInterval: 2000
    })
    
    this.game.engine.addStatusEffect(effect)
  }
};
