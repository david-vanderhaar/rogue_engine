import * as Constant from '../../../../constants';
import {CoverWall, ThrowableSpawner, SmokeParticle} from '../../../../Entities/index';
import { SOUNDS } from '../../sounds';
import {COLORS} from '../../theme';

export const ShinoBugCage = ({engine, range}) => new ThrowableSpawner({
  game: engine.game,
  name: 'Kikaichu Cage',
  passable: true,
  renderer: {
    character: 'b',
    sprite: 'b',
    color: COLORS.shino,
    background: COLORS.shino_alt,
  },
  attackDamage: 0,
  speed: Constant.ENERGY_THRESHOLD * range,
  energy: Constant.ENERGY_THRESHOLD * range,
  spawnStructure: Constant.CLONE_PATTERNS.square,
  spawnedEntityClass: CoverWall,
  spawnedEntityOptions: {
    passable: false,
    renderer: {
      character: 'b',
      sprite: 'b',
      color: COLORS.shino,
      background: COLORS.shino_alt,
      animation: [
        { background: COLORS.shino_alt, color: COLORS.shino, character: 'd', sprite: 'd', passable: false, },
        { background: COLORS.shino_alt, color: COLORS.shino, character: 'b', sprite: 'b', passable: false, },
      ]
    },
    name: 'kikaichu',
    game: engine.game,
    durability: 3,
    accuracyModifer: -0.3,
    damageModifer: 0,
  },
  range,
  onDestroy: (actor) => {
    actor.spawnEntities()
    playBugSounds()
  },
})

function playBugSounds() {
  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      SOUNDS[`bug_step_0${i + 1}`].play()
    }, i * 200);
  }
}
