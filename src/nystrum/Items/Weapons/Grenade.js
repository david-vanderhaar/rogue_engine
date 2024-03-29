import * as Constant from '../../constants';
import {Grenade as GrenadeEntity} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';

export const Grenade = (engine, range, attackDamage = 10) => new GrenadeEntity({
  game: engine.game,
  name: 'Grenade',
  passable: true,
  lightPassable: true,
  renderer: {
    character: 'x',
    sprite: '',
    color: COLORS.red,
    background: COLORS.base02,
  },
  flammability: 0,
  explosivity: 3,
  attackDamage,
  speed: Constant.ENERGY_THRESHOLD * range,
  energy: 0,
  range,
})
