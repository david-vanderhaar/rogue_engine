import { COLORS } from '../../theme';
import * as Constant from '../../../../constants';
import {DirectionalProjectile} from '../../../../Entities/index';

export const WindSlice = (engine, position, direction, range) => new DirectionalProjectile({
  game: engine.game,
  name: 'wind slice',
  // name: TYPE.DIRECTIONAL_KUNAI,
  direction,
  passable: true,
  lightPassable: true,
  pos: position,
  renderer: {
    character: '>',
    sprite: '>',
    color: COLORS.temari,
    background: COLORS.white,
  },
  traversableTiles: ['WATER'],
  durability: 1,
  attackDamage: 2,
  energy: 0,
  speed: Constant.ENERGY_THRESHOLD * range,
  range,
})
