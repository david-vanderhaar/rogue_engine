import { getRandomInArray } from '../../../../../helper';
import * as Constant from '../../../../constants';
import {DeterioratingWeapon, Weapon} from '../../../../Entities/index';
import {COLORS as HIDDEN_LEAF_COLORS} from '../../../HiddenLeaf/theme';

export const Mace = (engine, position = {x: 1, y: 1}) => new DeterioratingWeapon({
  game: engine.game,
  name: 'mace',
  baseDescription: 'A heavy weapon with a spiked head.',
  passable: true,
  lightPassable: true,
  pos: position,
  attackDamage: 2,
  durability: 1,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'j',
    sprite: 'j',
    color: HIDDEN_LEAF_COLORS.wraps,
    background: HIDDEN_LEAF_COLORS.dirt00,
  },
})

export const DaoSword = (engine, position = {x: 1, y: 1}) => new DeterioratingWeapon({
  game: engine.game,
  name: 'dao sword',
  baseDescription: 'A curved sword with a single edge.',
  passable: true,
  lightPassable: true,
  pos: position,
  attackDamage: 1,
  durability: 1,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: '/',
    sprite: '/',
    color: HIDDEN_LEAF_COLORS.wraps,
    background: HIDDEN_LEAF_COLORS.dirt00,
  },
})

export const BoStaff = (engine, position = {x: 1, y: 1}) => new DeterioratingWeapon({
  game: engine.game,
  name: 'bo staff',
  baseDescription: 'A long staff made of wood.',
  passable: true,
  lightPassable: true,
  pos: position,
  attackDamage: 1,
  durability: 2,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: '|',
    sprite: '|',
    color: HIDDEN_LEAF_COLORS.wraps,
    background: HIDDEN_LEAF_COLORS.dirt00,
  },
})

export const getRandomWeapon = (engine, position) => {
  const weapons = [Mace, DaoSword, BoStaff];
  return getRandomInArray(weapons)(engine, position);
}