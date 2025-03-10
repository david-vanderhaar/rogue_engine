import * as Constant from '../../../../constants';
import {Grenade as GrenadeEntity} from '../../../../Entities/index';
import { COLORS } from '../../theme';

export const Grenade = (engine, position) => new GrenadeEntity({
  game: engine.game,
  name: 'grenade',
  passable: true,
  lightPassable: true,
  pos: position,
  renderer: {
    character: 'o',
    sprite: '',
    color: COLORS.green_3,
    background: COLORS.green_1,
  },
  flammability: 0,
  explosivity: 2,
  attackDamage: 4,
  speed: Constant.ENERGY_THRESHOLD * 5,
  energy: 0,
  range: 5,
})
