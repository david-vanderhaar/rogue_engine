import { COLORS } from '../../theme';
import * as Constant from '../../../../constants';
import {MovingWall} from '../../../../Entities/index';

export const WindPush = (engine, position) => new MovingWall({
  game: engine.game,
  name: 'wind push',
  passable: false,
  lightPassable: true,
  pos: position,
  renderer: {
    character: '〣',
    sprite: '〣',
    color: COLORS.temari,
    background: COLORS.white,
  },
  durability: 1,
  attackDamage: 0,
  energy: 0,
  speed: Constant.ENERGY_THRESHOLD * 10,
  range: 10,
})
