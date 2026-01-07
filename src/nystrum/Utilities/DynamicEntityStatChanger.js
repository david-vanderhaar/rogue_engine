import * as Helper from '../../helper.js'
import * as _ from 'lodash'

export default class DynamicEntityStatChanger {
  constructor({
    entity = null,
    statAttributeIncreaseFunction = null,
    statAttributeDecreaseFunction = null,
    statAttributePath = '',
    statAttributePathMax = '',
    statAttributeValueMax = null,
    statAttributePathMin = '',
    statAttributeValueMin = null,
    changeByValue = 1,
  }) {
    this.entity = entity
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
    // try to change stat using function
    let didChange = this.functionStatChange() 
    if (!didChange) {
      didChange = this.manualStatChange()
    }
    
    return didChange
  }

  functionStatChange() {
    if (this.statAttributeIncreaseFunction && this.entity[this.statAttributeIncreaseFunction]) {
      this.entity[this.statAttributeIncreaseFunction](this.changeByValue)
      return true
    } else if (this.statAttributeDecreaseFunction && this.entity[this.statAttributeDecreaseFunction]) {
      this.entity[this.statAttributeDecreaseFunction](this.changeByValue)
      return true
    }

    return false
  }

  manualStatChange() {
    // try to find stat
    // if it does not exist, return early
    const stat = _.get(this.entity, this.statAttributePath, null)
    if (stat === null) console.log('StatChange: stat not found. Path: ', this.statAttributePath)
    if (!stat) return false
  
    // if min/max path not specified or found
    // then set to positive or negative infinity
    const max = this.statAttributeValueMax || _.get(this.entity, this.statAttributePathMax, Infinity)
    const min = this.statAttributeValueMin || _.get(this.entity, this.statAttributePathMin, -Infinity)
  
    // change by value, clamped to min/max
    const newValue = Helper.clamp(stat + this.changeByValue, min, max)

    // nothing changed
    console.log(newValue, stat);
    
    if (newValue === stat) return false

    _.set(this.entity, this.statAttributePath, newValue)
    return true
  }
}