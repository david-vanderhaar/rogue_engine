import { Base } from './Base.js';
import SpatterEmitter from '../Engine/Particle/Emitters/spatterEmitter.js';
import DynamicEntityStatChanger from '../Utilities/DynamicEntityStatChanger.js';
import * as Helper from '../../helper.js';
import { SOUNDS } from '../Modes/HiddenLeaf/sounds.js';
import { COLORS } from '../Modes/HiddenLeaf/theme.js';

export class StatChangeAtTargetPosition extends Base {
  constructor({
    targetPos,
    statAttributeIncreaseFunction = null,
    statAttributeDecreaseFunction = null,
    statAttributePath = '',
    statAttributePathMax = '',
    statAttributeValueMax = null,
    statAttributePathMin = '',
    statAttributeValueMin = null,
    changeByValue = 1,
    ...args
  }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.statAttributePath = statAttributePath
    this.statAttributePathMax = statAttributePathMax
    this.statAttributeValueMax = statAttributeValueMax
    this.statAttributePathMin = statAttributePathMin
    this.statAttributeValueMin = statAttributeValueMin
    this.statAttributeIncreaseFunction = statAttributeIncreaseFunction
    this.statAttributeDecreaseFunction = statAttributeDecreaseFunction
    this.changeByValue = changeByValue
  }

  perform() {
    let success = false;
    success = this.updateStat()

    if (success) {
      this.playSound()
      this.playParticleEffect()
    }

    return {
      success,
      alternative: null,
    };
  }

  playSound() {
    // override in subclass if needed
    SOUNDS.status_effect_applied.play()
  }

  updateStat() {
    // use dynamic stat changer to remove 1 stat point from target
    // and add 1 stat point to this.actor
    const target = this.getTarget()
    let changed = false;

    if (target) {
      changed = this.statChanger(target).perform()
    }

    return changed;
  }

  getTarget() {
    let tile = this.game.map[Helper.coordsToString(this.targetPos)];
    if (!tile) return null;
    return Helper.getFirstDestructableEntity(tile.entities)
  }

  statChanger(entity, changeByValue = this.changeByValue) {
    return new DynamicEntityStatChanger({
      entity,
      statAttributeIncreaseFunction: this.statAttributeIncreaseFunction,
      statAttributeDecreaseFunction: this.statAttributeDecreaseFunction,
      statAttributePath: this.statAttributePath,
      statAttributePathMax: this.statAttributePathMax,
      statAttributeValueMax: this.statAttributeValueMax,
      statAttributePathMin: this.statAttributePathMin,
      statAttributeValueMin: this.statAttributeValueMin,
      changeByValue
    })
  }

  playParticleEffect() {
    SpatterEmitter({
      game: this.game,
      fromPosition: this.actor.getPosition(),
      spatterAmount: 0.1,
      spatterRadius: 4,
      animationTimeStep: 0.6,
      transfersBackground: false,
      spatterColors: [COLORS.chakra, COLORS.shino_alt]
    }).start()
  }
}

