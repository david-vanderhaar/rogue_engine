import * as Constant from '../../constants';
import { COLORS } from '../../Modes/TallGrass/theme';
import { Light } from '../../Entities';


export const Lantern = ({engine, lightRange = 8}) => {
  return new Light({
    lightRange,
    game: engine.game,
    name: 'lantern',
    passable: true,
    lightPassable: true,
    equipmentType: Constant.EQUIPMENT_TYPES.HAND,
    renderer: {
      character: 'o',
      sprite: '',
      color: COLORS.white,
      background: COLORS.sunset,
    },
  })
}

export const Beacon = ({engine, lightRange = 8, lightDrain = false}) => {
  return new Light({
    lightRange,
    game: engine.game,
    name: 'beacon',
    passable: false,
    lightPassable: true,
    lightDrain: lightDrain,
    equipmentType: Constant.EQUIPMENT_TYPES.HAND,
    renderer: {
      character: 'o',
      sprite: '',
      color: COLORS.white,
      background: COLORS.sunset,
    },
  })
}