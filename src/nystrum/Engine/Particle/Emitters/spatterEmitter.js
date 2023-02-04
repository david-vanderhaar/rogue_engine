import { ParticleEmitter } from '../particleEmitter'
import * as Helper from '../../../../helper'

export default ({
  game,
  fromPosition,
  spatterRadius = 3,
  spatterAmount = .3, // percent
  spatterDirection = {x: 0, y: 0},
  spatterColors = ['#ff551a', '#673ab7', '#aa2123'],
  animationTimeStep = 0.2,
}) => {
  const emitter = new ParticleEmitter({
    game,
    easingFunction: Helper.EASING.easeOut,
    animationTimeStep,
  })

  // get all points in radius
  // filter out points not in direction of spatterDirection
  // pick random number of these points based on spatterAmount 
  const pointsInRange = Helper
    .getPointsWithinRadius(fromPosition, spatterRadius)
    .filter((point) => Math.sign(spatterDirection.x - point.x) < 0 && Math.sign(spatterDirection.y - point.y) < 0)
    .filter(() => Math.random() < spatterAmount)
    
  pointsInRange.forEach((targetPos) => {
    const path = Helper.calculateAstar8Path(game, fromPosition, targetPos);
    const colorGradient = [Helper.getRandomInArray(spatterColors), Helper.getRandomInArray(spatterColors)]
    const backgroundColorGradient = [...colorGradient].reverse()
    path.push({ ...targetPos })
    emitter.addParticle({
      life: path.length + 1,
      pos: { ...path[0] },
      path,
      rendererGradients: {
        color: colorGradient,
        backgroundColor: backgroundColorGradient,
      },
    });
  })

  return emitter
}