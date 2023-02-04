import GradientPathEmitter from './gradientPathEmitter'
import * as Helper from '../../../../helper'

export default ({
  game,
  fromPosition,
  radius,
  colorGradient = ['#ff551a', '#673ab7'],
  backgroundColorGradient = ['#673ab7', '#ff551a'],
  easingFunction = Helper.EASING.linear,
  animationTimeStep = 0.2,
}) => {
  const targetPositions = Helper.getPointsOnCircumference(fromPosition.x, fromPosition.y, radius)
  const emitter = GradientPathEmitter({
    game,
    fromPosition,
    targetPositions,
    colorGradient,
    backgroundColorGradient,
    easingFunction,
    animationTimeStep,
  })

  return emitter
}
