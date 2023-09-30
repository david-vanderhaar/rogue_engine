
import { ParticleEmitter } from '../particleEmitter'
import * as Helper from '../../../../helper'

export default ({
  game,
  fromPosition,
  spatterRadius = 3,
  spatterAmount = .3, // percent
  spatterDirection = {x: 0, y: 0},
  // spatterColors = ['#ff551a', '#673ab7', '#aa2123'],
  spatterColors = ['#833139', '#aa2123'],
  animationTimeStep = 0.2,
  reverse = false,
  transfersBackground = false,
  transfersBackgroundOnDestroy = false,
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
    .getPointsWithinRadiusInDirections(fromPosition, spatterRadius, spatterDirection)
    .filter(() => Math.random() < spatterAmount)
    
  pointsInRange.forEach((targetPos) => {
    let path = Helper.calculateAstar8Path(game, fromPosition, targetPos);
    path.push({ ...targetPos })
    if (reverse) path = path.reverse()
    const colorGradient = [Helper.getRandomInArray(spatterColors), Helper.getRandomInArray(spatterColors)]
    const backgroundColorGradient = [...colorGradient].reverse()
    emitter.addParticle({
      life: path.length + 1,
      pos: { ...path[0] },
      path,
      transfersBackground,
      transfersBackgroundOnDestroy,
      rendererGradients: {
        color: colorGradient,
        backgroundColor: backgroundColorGradient,
      },
    });
  })

  return emitter
}
