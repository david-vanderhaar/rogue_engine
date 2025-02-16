import {Base} from './Base.js'
import * as Helper from '../../helper.js'
import * as _ from 'lodash'
import {ANIMATION_TYPES} from '../Display/konvaCustom.js'
import DynamicEntityStatChanger from '../Utilities/DynamicEntityStatChanger.js';

export default class ConstantStatChange extends Base {
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
    this.name = 'stat change';
    this.description = "this stat is changing every step"
    this.allowDuplicates = true
    this.processOnlyOnActorTurn = true
    this.lifespan = -1
    this.statAttributePath = statAttributePath
    this.statAttributePathMax = statAttributePathMax
    this.statAttributeValueMax = statAttributeValueMax
    this.statAttributePathMin = statAttributePathMin
    this.statAttributeValueMin = statAttributeValueMin
    this.statAttributeIncreaseFunction = statAttributeIncreaseFunction
    this.statAttributeDecreaseFunction = statAttributeDecreaseFunction
    this.changeByValue = changeByValue
  }

  step(timePassed) {
    super.step(timePassed)
    // try to change stat using function
    this.statChanger().perform()
    // add text float animation
    this.addChangeAnimation(this.changeByValue)
  }

  statChanger() {
    return new DynamicEntityStatChanger({
      entity: this.actor,
      statAttributeIncreaseFunction: this.statAttributeIncreaseFunction,
      statAttributeDecreaseFunction: this.statAttributeDecreaseFunction,
      statAttributePath: this.statAttributePath,
      statAttributePathMax: this.statAttributePathMax,
      statAttributeValueMax: this.statAttributeValueMax,
      statAttributePathMin: this.statAttributePathMin,
      statAttributeValueMin: this.statAttributeValueMin,
      changeByValue: this.changeByValue
    })
  }

  addChangeAnimation(value) {
    let sign = ''
    if (value > 0) sign = '+'

    const text = sign + value
    this.animateText(text, this.renderer.color)
  }

  animateText(text, color) {
    this.game.display.addAnimation(
      ANIMATION_TYPES.TEXT_FLOAT,
      {
        ...this.actor.getPosition(),
        color,
        text,
        timeToLive: 750,
      }
    );
  }
}