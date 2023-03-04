import * as Constant from '../../constants';
import { pipe } from 'lodash/fp';
import { Rendering } from '../../Entities/Rendering';
import { Equipable } from '../../Entities/Equipable';
import { Illuminating } from '../../Entities/Illuminating';
import { Entity } from '../../Entities/Entity';
import { COLORS } from '../../Modes/TallGrass/theme';

const Light = pipe(
  Rendering,
  Equipable,
  Illuminating,
)(Entity)


export const Lantern = ({engine, lightRange = 8}) => {
  return new Light({
    lightRange,
    game: engine.game,
    name: 'Lantern',
    passable: true,
    equipmentType: Constant.EQUIPMENT_TYPES.HAND,
    renderer: {
      character: 'o',
      sprite: '',
      color: COLORS.white,
      background: COLORS.sunset,
    },
  })
}