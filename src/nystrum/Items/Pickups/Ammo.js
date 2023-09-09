import {Ammo as AmmoEntity} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';

export const Ammo = (engine) => new AmmoEntity({
  game: engine.game,
  name: 'Ammo',
  passable: true,
  lightPassable: true,
  renderer: {
    character: '||',
    sprite: '',
    background: COLORS.gray,
    color: COLORS.base3,
  },
  flammability: 0,
  explosivity: 0,
});