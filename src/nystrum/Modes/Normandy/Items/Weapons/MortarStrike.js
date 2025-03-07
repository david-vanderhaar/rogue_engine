import * as Constant from '../../../../constants';
import {CoverWall, ThrowableSpawner, TelegraphedExploder} from '../../../../Entities/index';
import {COLORS} from '../../theme';
import { JACINTO_SOUNDS } from '../../../Jacinto/sounds';

export const MortarStrike = (engine, pos) => new ThrowableSpawner({
  game: engine.game,
  name: 'Morar Strike',
  passable: true,
  lightPassable: true,
  pos: pos,
  renderer: {
    character: 'o',
    sprite: '',
    color: COLORS.red,
    background: COLORS.base02,
  },
  attackDamage: 0,
  speed: Constant.ENERGY_THRESHOLD,
  energy: 0,
  spawnStructure: Constant.CLONE_PATTERNS.square,
  spawnedEntityClass: TelegraphedExploder,
  spawnedEntityOptions: {
    passable: true,
    lightPassable: true,
    renderer: {
      character: '▓',
      sprite: '▓',
      color: COLORS.red,
      background: COLORS.red,
    },
    name: 'explosion',
    game: engine.game,
    durability: 1,
    flammability: 0,
    explosivity: 1,
    attackDamage: 4,
  },
  range: 1,
  onDestroy: (actor) => {
    JACINTO_SOUNDS.smoke_grenade_fire.play()
    actor.spawnEntities()
  },
})

