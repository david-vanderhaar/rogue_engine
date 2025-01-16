import {Base} from './Base.js'
import * as Helper from '../../helper.js'
import * as _ from 'lodash'
import {ANIMATION_TYPES} from '../Display/konvaCustom.js'

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
    this.processOnlyOnPlayerTurn = true
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
    console.log('ConstantStatChange: onStep ', this.statAttributePath);
    
    // try to change stat using function
    const didChange = this.functionStatChange() 
    if (!didChange) this.manualStatChange() 

    // add text float animation
    this.addChangeAnimation(this.changeByValue)
  }

  functionStatChange() {
    if (this.statAttributeIncreaseFunction && this.actor[this.statAttributeIncreaseFunction]) {
      this.actor[this.statAttributeIncreaseFunction](this.changeByValue)
      return true
    } else if (this.statAttributeDecreaseFunction && this.actor[this.statAttributeDecreaseFunction]) {
      this.actor[this.statAttributeDecreaseFunction](this.changeByValue)
      return true
    }

    return false
  }

  manualStatChange() {
    // try to find stat
    // if it does not exist, return early
    const stat = _.get(this.actor, this.statAttributePath, null)
    if (stat === null) console.log('StatChange: stat not found. Path: ', this.statAttributePath)
    if (!stat) return
  
    // if min/max path not specified or found
    // then set to positive or negative infinity
    const max = this.statAttributeValueMax || _.get(this.actor, this.statAttributePathMax, Infinity)
    const min = this.statAttributeValueMin || _.get(this.actor, this.statAttributePathMin, -Infinity)
  
    // change by value, clamped to min/max
    const newValue = Helper.clamp(stat + this.changeByValue, min, max)
    _.set(this.actor, this.statAttributePath, newValue)
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