import * as Constant from '../../../../constants';
import {RangedWeapon} from '../../../../Entities/index';
import { JACINTO_SOUNDS } from '../../../Jacinto/sounds';
import {COLORS} from '../../../Jacinto/theme';
import {COLORS as TALL_GRASS_COLORS} from '../../../TallGrass/theme';

export const Revolver = (engine, position = {x: 1, y: 1}) => new RangedWeapon({
  game: engine.game,
  name: 'revolver',
  baseDescription: 'an old revolver. you didn\'t think these were even still issued to field members anymore.',
  passable: true,
  lightPassable: true,
  attackRange: 6,
  magazineSize: 4,
  baseRangedAccuracy: 1,
  baseRangedDamage: 1,
  attackDamage: 0,
  pos: position,
  // shapePattern: Constant.CLONE_PATTERNS.triple_point,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'r',
    color: COLORS.base3,
    background: TALL_GRASS_COLORS.raw_umber,
  },
  rangedHitSounds: [
    JACINTO_SOUNDS.pistol_fire_01,
    JACINTO_SOUNDS.pistol_fire_02,
  ],
  rangedMissSounds: [
    JACINTO_SOUNDS.bullet_miss_01,
    JACINTO_SOUNDS.bullet_miss_02,
    JACINTO_SOUNDS.bullet_miss_03,
  ]
});

export const Pistol = (engine, position = {x: 1, y: 1}) => new RangedWeapon({
  game: engine.game,
  name: 'pistol',
  baseDescription: 'standard issue, with a nice bit of range.',
  passable: true,
  lightPassable: true,
  attackRange: 6,
  magazineSize: 6,
  baseRangedAccuracy: 1,
  baseRangedDamage: 1,
  attackDamage: 0,
  pos: position,
  // shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'p',
    color: COLORS.base3,
    background: TALL_GRASS_COLORS.gray,
  },
  rangedHitSounds: [
    JACINTO_SOUNDS.pistol_fire_01,
    JACINTO_SOUNDS.pistol_fire_02,
  ],
  rangedMissSounds: [
    JACINTO_SOUNDS.bullet_miss_01,
    JACINTO_SOUNDS.bullet_miss_02,
    JACINTO_SOUNDS.bullet_miss_03,
  ]
});

export const Rifle = (engine, position = {x: 1, y: 1}) => new RangedWeapon({
  game: engine.game,
  name: 'rifle',
  baseDescription: 'C.C.C. reluctantly began issuing these rifles a decade ago, after we got called into Layoria.',
  passable: true,
  lightPassable: true,
  attackRange: 8,
  magazineSize: 4,
  baseRangedAccuracy: 1,
  baseRangedDamage: 2,
  attackDamage: 0,
  pos: position,
  // shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'L',
    color: COLORS.base3,
    background: TALL_GRASS_COLORS.ebony,
  },
  rangedHitSounds: [
    JACINTO_SOUNDS.cog_rifle_fire_01,
    JACINTO_SOUNDS.cog_rifle_fire_02,
    JACINTO_SOUNDS.cog_rifle_fire_03,
    JACINTO_SOUNDS.cog_rifle_fire_04,
  ],
  rangedMissSounds: [
    JACINTO_SOUNDS.bullet_miss_01,
    JACINTO_SOUNDS.bullet_miss_02,
    JACINTO_SOUNDS.bullet_miss_03,
  ]
});

export const Shotgun = (engine, position = {x: 1, y: 1}) => new RangedWeapon({
  game: engine.game,
  name: 'shotgun',
  baseDescription: 'a pump-action shotgun. you were really hoping for an auto-loader.',
  passable: true,
  lightPassable: true,
  attackRange: 6,
  magazineSize: 3,
  baseRangedAccuracy: 1,
  baseRangedDamage: 1,
  attackDamage: 0,
  pos: position,
  shapePattern: Constant.CLONE_PATTERNS.smallSquare,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 's',
    color: TALL_GRASS_COLORS.white,
    background: TALL_GRASS_COLORS.raw_umber,
  },
  rangedHitSounds: [
    JACINTO_SOUNDS.boltok_fire_01,
    JACINTO_SOUNDS.boltok_fire_02,
  ],
  rangedMissSounds: [
    JACINTO_SOUNDS.bullet_miss_01,
    JACINTO_SOUNDS.bullet_miss_02,
    JACINTO_SOUNDS.bullet_miss_03,
  ]
});
