import { RangedWeapon } from '../../../../Entities';
import { JACINTO_SOUNDS } from '../../../Jacinto/sounds';
import { COLORS } from '../../theme';
import * as Constant from '../../../../constants';

export const GrenadeThrower = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Grenade Thrower',
  passable: true,
  attackRange: 4,
  magazineSize: 1,
  baseRangedAccuracy: 0.5,
  baseRangedDamage: 0,
  attackDamage: 0,
  pos,
  shapePattern: Constant.CLONE_PATTERNS.clover,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'g',
    color: COLORS.base03,
    background: COLORS.green,
  },
  rangedHitSounds: [
    JACINTO_SOUNDS.explosion_01,
    JACINTO_SOUNDS.explosion_01,
  ],
});
