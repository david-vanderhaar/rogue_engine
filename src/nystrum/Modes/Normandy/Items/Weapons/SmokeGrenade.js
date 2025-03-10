import * as Constant from '../../../../constants';
import {CoverWall, ThrowableSpawner, SmokeParticle} from '../../../../Entities/index';
import {COLORS} from '../../theme';
import { JACINTO_SOUNDS } from '../../../../Modes/Jacinto/sounds';

const RANGE = 2;
export const SmokeGrenade = (engine, position) => new ThrowableSpawner({
  game: engine.game,
  name: 'Smoke Grenade',
  pos: position,
  passable: true,
  renderer: {
    character: 'o',
    sprite: '',
    color: COLORS.green_1,
    background: COLORS.white,
  },
  attackDamage: 0,
  speed: Constant.ENERGY_THRESHOLD * RANGE,
  energy: 0,
  spawnStructure: Constant.CLONE_PATTERNS.small_circle,
  spawnedEntityClass: SmokeParticle,
  spawnedEntityOptions: {
    passable: true,
    lightPassable: true,
    renderer: {
      character: '',
      sprite: '',
      color: COLORS.blue_0,
      background: COLORS.white,
      animation: [
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '', sprite: '', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '.', sprite: '.', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '.', sprite: '.', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '.', sprite: '.', passable: true, },
        { background: COLORS.white, color: COLORS.blue_0, character: '`', sprite: '`', passable: true, },
      ]
    },
    name: 'Smoke',
    game: engine.game,
    durability: 18,
    accuracyModifer: -0.3,
    damageModifer: 0,
  },
  RANGE,
  onDestroy: (actor) => {
    JACINTO_SOUNDS.smoke_grenade_fire.play()
    actor.spawnEntities()
  },
})
