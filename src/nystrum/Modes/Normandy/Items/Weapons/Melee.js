import * as Constant from '../../../../constants';
import { Weapon} from '../../../../Entities/index';
import {COLORS as TALL_GRASS_COLORS} from '../../../TallGrass/theme';

// The Creature Containment Coalition

export const Knife = (engine, position = {x: 1, y: 1}) => new Weapon({
  game: engine.game,
  name: 'knife',
  baseDescription: 'a standard issue knife.',
  passable: true,
  lightPassable: true,
  pos: position,
  attackDamage: 1,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: '/',
    sprite: '',
    color: TALL_GRASS_COLORS.gray,
    background: TALL_GRASS_COLORS.white,
  },
})
