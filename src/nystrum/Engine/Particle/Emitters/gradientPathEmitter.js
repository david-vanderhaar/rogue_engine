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
}) => {
  const emitter = new ParticleEmitter({
    game,
    easingFunction,
    animationTimeStep,
  })

  targetPositions.forEach((targetPos) => {
    const path = Helper.calculateAstar8Path(game, fromPosition, targetPos);
    path.push({ ...targetPos })

    const firstPos = path[0]
    path.forEach((pos, index) => {
      const particlePath = [...Array(index).fill({ ...firstPos }), ...path]
      emitter.addParticle({
        life: particlePath.length + 1,
        pos: { ...firstPos },
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
