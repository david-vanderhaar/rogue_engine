import * as Constant from '../../../../constants';
import {RangedWeapon, Weapon} from '../../../../Entities/index';
import { JACINTO_SOUNDS } from '../../../Jacinto/sounds';
import {COLORS} from '../../../Jacinto/theme';
import {COLORS as TALL_GRASS_COLORS} from '../../../TallGrass/theme';

// The Creature Containment Coalition

export const Knife = (engine, position = {x: 1, y: 1}) => new Weapon({
  game: engine.game,
  name: 'C.C.C. defensive knife',
  baseDescription: 'a standard issue blade given to every member of the C.C.C.',
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

export const Machete = (engine, position = {x: 1, y: 1}) => new Weapon({
  game: engine.game,
  name: 'C.C.C. field machete',
  baseDescription: 'the C.C.C. requires all member in this area to carry a machete. The more you can keep these paths cleared, the better.',
  passable: true,
  lightPassable: true,
  pos: position,
  attackDamage: 2,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: '/',
    sprite: '',
    color: TALL_GRASS_COLORS.white,
    background: TALL_GRASS_COLORS.gray,
  },
})

export const CombatBaton = (engine, position = {x: 1, y: 1}) => new Weapon({
  game: engine.game,
  name: 'C.C.C. combat baton',
  baseDescription: 'normally used for crowd control in densly populated area.',
  passable: true,
  lightPassable: true,
  pos: position,
  attackDamage: 3,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'b',
    sprite: '',
    color: TALL_GRASS_COLORS.black,
    background: TALL_GRASS_COLORS.brown_sugar,
  },
})

export const Katana = (engine, position = {x: 1, y: 1}) => new Weapon({
  game: engine.game,
  name: 'ancient katana',
  baseDescription: 'hmm, this could work.',
  passable: true,
  lightPassable: true,
  pos: position,
  attackDamage: 6,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'k',
    sprite: 'k',
    color: TALL_GRASS_COLORS.red,
    background: TALL_GRASS_COLORS.black,
  },
})
