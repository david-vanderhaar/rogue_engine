import * as Constant from '../../../../constants';
import {RangedWeapon} from '../../../../Entities/index';
import { JACINTO_SOUNDS } from '../../../Jacinto/sounds';
import {COLORS} from '../../../Jacinto/theme';

export const SpitterSac = (engine, position) => new RangedWeapon({
  game: engine.game,
  name: 'spitter sac',
  passable: true,
  attackRange: 3,
  magazineSize: 10,
  baseRangedAccuracy: 0.6,
  baseRangedDamage: 1,
  attackDamage: 1,
  pos: position,
  // shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'o',
    color: COLORS.green,
    background: COLORS.base01,
  },
  rangedHitSounds: [
    JACINTO_SOUNDS.sac_01,
    JACINTO_SOUNDS.sac_02,
    JACINTO_SOUNDS.sac_03,
  ],
  rangedMissSounds: [
    JACINTO_SOUNDS.screech_01,
    JACINTO_SOUNDS.screech_02,
    JACINTO_SOUNDS.screech_03,
  ],
  rangedReloadSounds: [
    JACINTO_SOUNDS.screech_01,
    JACINTO_SOUNDS.screech_02,
    JACINTO_SOUNDS.screech_03,
  ]
});
