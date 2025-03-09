import * as Constant from '../../../../constants';
import {CoverWall, ThrowableSpawner, TelegraphedExploder} from '../../../../Entities/index';
import {COLORS} from '../../theme';
import { JACINTO_SOUNDS } from '../../../Jacinto/sounds';
import { getEntitiesByPositionByAttr, getPointsWithinRadius, getRandomFloat, getRandomInArray } from '../../../../../helper';
import * as MapHelper from '../../../../Maps/helper';
import { Foxhole } from '../Environment/Foxhole';

export const MortarStrike = (engine, pos, size = 2) => new ThrowableSpawner({
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
  energy: 100,
  spawnPoints: getPointsWithinRadius(pos, size),
  spawnedEntityClass: TelegraphedExploder,
  spawnedEntityOptions: {
    passable: true,
    lightPassable: true,
    renderer: { character: '/', sprite: '/', color: COLORS.red_1, background: COLORS.red_0, animation: [
      { character: '\\', sprite: '\\', color: COLORS.red_1, background: COLORS.red_0 },
      { character: '/', sprite: '/', color: COLORS.red_1, background: COLORS.red_0 },
    ] },
    name: 'explosion',
    game: engine.game,
    durability: 1,
    flammability: 0,
    explosivity: 1,
    attackDamage: 4,
    onDestroy: (actor) => {
      playExplosionSound();
      const existingBerms = getEntitiesByPositionByAttr({
        game: engine.game,
        position: actor.getPosition(),
        attr: 'name',
        value: 'berm', 
      })
      
      // don't create a new foxhole if there are existing berms
      if (existingBerms.length) return;
      Foxhole(actor.getPosition(), engine.game, 1);
    }
  },
  range: 1,
  onDestroy: (actor) => {
    playIncomingSound();
    actor.spawnEntities()
  },
})

function playExplosionSound() {
  const sounds = [
    JACINTO_SOUNDS.mortar_hit_00,
    JACINTO_SOUNDS.mortar_hit_01,
    JACINTO_SOUNDS.mortar_hit_02,
    JACINTO_SOUNDS.mortar_hit_03,
    JACINTO_SOUNDS.mortar_hit_04,
  ]
  const sound = getRandomInArray(sounds);
  if (!sound.playing()) {
    sound.stop();
    sound.play();
  }
}

function playIncomingSound() {
  const sounds = [
    JACINTO_SOUNDS.mortar_incoming_00,
    JACINTO_SOUNDS.mortar_incoming_01,
    JACINTO_SOUNDS.mortar_incoming_02,
  ];
  const sound = getRandomInArray(sounds);
  if (!sound.playing()) {
    sound.play();
  }
}
