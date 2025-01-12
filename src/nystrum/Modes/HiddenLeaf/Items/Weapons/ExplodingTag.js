import { COLORS } from '../../theme';
import * as Constant from '../../../../constants';
import {Grenade as GrenadeEntity} from '../../../../Entities/index';

export const ExplodingTag = (engine, position) => new GrenadeEntity({
  game: engine.game,
  name: 'exploding tag',
  passable: true,
  lightPassable: true,
  pos: position,
  renderer: {
    character: '!',
    sprite: '!',
    color: COLORS.red,
    background: COLORS.wraps,
  },
  flammability: 2,
  explosivity: 2,
  timeToSpread: 1,
  spreadCount: 1,
  attackDamage: 4,
  speed: Constant.ENERGY_THRESHOLD * 5,
  energy: 0,
  range: 5,
})
