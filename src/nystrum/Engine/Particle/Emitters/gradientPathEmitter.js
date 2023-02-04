import { ParticleEmitter } from '../particleEmitter'
import * as Helper from '../../../../helper'

export default ({
  game,
  fromPosition,
  targetPositions,
  colorGradient = ['#ff551a', '#673ab7'],
  backgroundColorGradient = ['#673ab7', '#ff551a'],
  easingFunction = Helper.EASING.linear,
  animationTimeStep = 0.2,
  reverse = false,
}) => {
  const emitter = new ParticleEmitter({
    game,
    easingFunction,
    animationTimeStep,
  })

  targetPositions.forEach((targetPos) => {
    let path = Helper.calculateAstar8Path(game, fromPosition, targetPos);
    path.push({ ...targetPos })
    if (reverse) path = path.reverse()
    path.forEach((pos, index) => {
      let particlePath = [...Array(index).fill({ ...path[0] }), ...path]
      emitter.addParticle({
        life: particlePath.length + 1,
        pos: particlePath[0],
        path: particlePath,
        rendererGradients: {
          color: colorGradient,
          backgroundColor: backgroundColorGradient,
        },
      });
    })
  })

  return emitter
}
