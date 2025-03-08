import * as Constant from '../../../../constants';
import {CoverWall, ThrowableSpawner, TelegraphedExploder} from '../../../../Entities/index';
import {COLORS} from '../../theme';
import { JACINTO_SOUNDS } from '../../../Jacinto/sounds';
import { getEntitiesByPositionByAttr, getPointsWithinRadius } from '../../../../../helper';
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
      // createFoxhole(actor.getPosition(), size);
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
    JACINTO_SOUNDS.smoke_grenade_fire.play()
    // createFoxhole(actor.getPosition(), size);
    actor.spawnEntities()
  },
})

function createFoxhole(pos, size) {
  MapHelper.addTileZoneFilledCircle(
    pos,
    size + 1,
    'GROUND_SAND_HOLE_EDGE',
  );
  // MapHelper.addTileZoneFilledCircle(
  //   pos,
  //   size,
  //   'GROUND_SAND_HOLE',
  // );
}
