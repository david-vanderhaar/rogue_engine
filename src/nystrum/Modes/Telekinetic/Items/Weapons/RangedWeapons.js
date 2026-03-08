import * as Constant from '../../../../constants';
import {RangedWeapon} from '../../../../Entities/index';
import { GAME } from '../../../../game';
import { JACINTO_SOUNDS } from '../../../Jacinto/sounds';
import {COLORS} from '../../theme';

export const NailGun = (engine = GAME.engine, position = {x: 1, y: 1}) => new RangedWeapon({
  game: engine.game,
  name: 'nail gun',
  baseDescription: 'an old nail gun.',
  passable: true,
  lightPassable: true,
  attackRange: 3,
  magazineSize: 100,
  baseRangedAccuracy: 0.5,
  baseRangedDamage: 1,
  attackDamage: 0,
  pos: position,
  // shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: '¬',
    color: COLORS.base3,
    background: COLORS.raw_umber,
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

export const Pistol = (engine = GAME.engine, position = {x: 1, y: 1}) => new RangedWeapon({
  game: engine.game,
  name: 'pistol',
  baseDescription: 'standard issue, with a nice bit of range.',
  passable: true,
  lightPassable: true,
  attackRange: 5,
  magazineSize: 100,
  baseRangedAccuracy: 0.8,
  baseRangedDamage: 1,
  attackDamage: 0,
  pos: position,
  // shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'p',
    color: COLORS.base3,
    background: COLORS.gray,
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
    background: COLORS.ebony,
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
    color: COLORS.white,
    background: COLORS.raw_umber,
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
