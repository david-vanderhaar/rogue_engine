import * as Helper from '../../../../../helper';
import {GlowingPickup} from '../../../../Entities/index';
import {COLORS} from '../../theme';

export const GlowStick = (engine, position, lightRange = 3, name = 'glow stick') => {
  let isUsed = false

  function activateLight(actor, item) {
    if (isUsed) return
    item.incrementLightRange(lightRange)
    item.name = 'used glow stick'
    item.renderer.color = COLORS.gray
    item.addDescriptor('a cracked glow stick, not much use anymore.')
    isUsed = true
  }

  const lightColor = Helper.getRandomInArray([COLORS.green, COLORS.violet, COLORS.magenta, COLORS.blue])

  return new GlowingPickup({
    name,
    passable: true,
    lightPassable: true,
    baseDescription: 'the C.C.C. doesn\'t generally give these out. luminescent chemical is too unstable they said.',
    lightRange: 0,
    lightColor,
    pos: position,
    renderer: {
      character: 'i',
      sprite: '',
      color: lightColor,
      background: COLORS.black,
    },
    dropEffects: [activateLight]
  });
}

export const SmallGlowStick = (engine, position) => GlowStick(engine, position, 3)
export const SuperGlowStick = (engine, position) => GlowStick(engine, position, 10, 'super glow stick')
