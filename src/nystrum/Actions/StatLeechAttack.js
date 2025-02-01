import { Attack } from './Attack';
import SpatterEmitter from '../Engine/Particle/Emitters/spatterEmitter';
import DynamicEntityStatChanger from '../Utilities/DynamicEntityStatChanger';
import * as Helper from '../../helper.js';

export class StatLeechAttack extends Attack {
  constructor({
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
    const attackResult = super.perform();

    if (attackResult.success) {
      this.leech()
    }

    return attackResult;
  }

  leech() {
    // use dynamic stat changer to remove 1 stat point from target
    // and add 1 stat point to this.actor
    const target = this.getTarget()
    if (target) {
      const leeched = this.statChanger(target).perform()
      if (leeched) this.statChanger(this.actor, Math.abs(this.changeByValue)).perform()
    }
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

  // onAfter() {
  //   super.onAfter();
  //   SpatterEmitter({
  //     game: this.game,
  //     fromPosition: this.actor.getPosition(),
  //     spatterAmount: 0.1,
  //     spatterRadius: 3,
  //     animationTimeStep: 0.6,
  //     transfersBackground: false,
  //     spatterColors: ['#94e0ef', '#d3d3d3', '#495877']
  //   }).start()
  // }
}

