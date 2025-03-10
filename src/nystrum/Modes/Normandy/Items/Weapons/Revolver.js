import * as Constant from '../../../../constants';
import {RangedWeapon} from '../../../../Entities/index';
import { JACINTO_SOUNDS } from '../../../Jacinto/sounds';
import {COLORS} from '../../../Jacinto/theme';
import {COLORS as TALL_GRASS_COLORS} from '../../../TallGrass/theme';

export const Revolver = (engine, position = {x: 1, y: 1}) => new RangedWeapon({
  game: engine.game,
  name: 'revolver',
  baseDescription: 'an old revolver. you didn\'t know these were still issued to new recruits.',
  passable: true,
  lightPassable: true,
  attackRange: 3,
  magazineSize: 2,
  baseRangedAccuracy: 0.3,
  baseRangedDamage: 2,
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
  attackRange: 3,
  magazineSize: 2,
  baseRangedAccuracy: 0.5,
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
  name: 'M1 Garand',
  baseDescription: 'M1 Garand. a classic.',
  passable: true,
  lightPassable: true,
  attackRange: 6,
  magazineSize: 5,
  baseRangedAccuracy: 0.5,
  baseRangedDamage: 1,
  attackDamage: 0,
  pos: position,
  // shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'm',
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

export const Karabiner = (engine, position = {x: 1, y: 1}) => new RangedWeapon({
  game: engine.game,
  name: 'K98 rifle',
  baseDescription: 'a German K98 rifle.',
  passable: true,
  lightPassable: true,
  attackRange: 5,
  magazineSize: 1,
  baseRangedAccuracy: 0.8,
  baseRangedDamage: 1,
  attackDamage: 0,
  pos: position,
  // shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'k',
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
  baseDescription: 'a pump-action shotgun.',
  passable: true,
  lightPassable: true,
  attackRange: 4,
  magazineSize: 3,
  baseRangedAccuracy: 0.5,
  baseRangedDamage: 3,
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
