import { add } from 'lodash';
import * as MapHelper from '../../../Maps/helper';
import { COLORS } from '../theme';
import * as Helper from '../../../../helper';
import { DirectionalProjectile, MovingWall } from '../../../Entities';

export function addWalls(mode,innerWalls = 4) {
  // outer walls
  MapHelper.addTileZoneRectUnfilled(
    mode.game.tileKey,
    { x: 0, y: 0 },
    mode.game.mapHeight,
    mode.game.mapWidth,
    'WALL',
    mode.game.map
  );

  // inner walls
  for (let index = 1; index <= innerWalls; index++) {
    MapHelper.addTileZoneRectUnfilled(
      mode.game.tileKey,
      { x: index, y: index },
      mode.game.mapHeight - (index * 2),
      mode.game.mapWidth - (index * 2),
      'WALL',
      mode.game.map
    );
  }
}

export function addOutsideWalls(mode) {
  // outer walls
  MapHelper.addTileZoneRectUnfilled(
    mode.game.tileKey,
    { x: 0, y: 0 },
    mode.game.mapHeight,
    mode.game.mapWidth,
    'WALL',
    mode.game.map
  );
}

export function addInnerWalls(mode, innerWalls = 4) {
  for (let index = 1; index <= innerWalls; index++) {
    MapHelper.addTileZoneRectUnfilled(
      mode.game.tileKey,
      { x: index, y: index },
      mode.game.mapHeight - (index * 2),
      mode.game.mapWidth - (index * 2),
      'WALL',
      mode.game.map
    );
  }
}

export function addInnerMostTileTypeFilled(mode, tileType, tier = 0) {
  MapHelper.addTileZoneRectFilled(
    mode.game.tileKey,
    { x: tier, y: tier },
    mode.game.mapHeight - (tier * 2),
    mode.game.mapWidth - (tier * 2),
    tileType,
    mode.game.map,
    mode.game.mapHeight,
    mode.game.mapWidth
  );
}

export function addInnerMostTileTypeUnfilled(mode, tileType, tier = 0) {
  MapHelper.addTileZoneRectUnfilled(
    mode.game.tileKey,
    { x: tier, y: tier },
    mode.game.mapHeight - (tier * 2),
    mode.game.mapWidth - (tier * 2),
    tileType,
    mode.game.map
  );
}

export function placePlayerInCenter(mode) {
  const player = mode.getPlayer();
  player.move(centerPosition(mode));
}

export function centerPosition (mode) {
  return  { x: Math.floor(mode.game.mapWidth / 2), y: Math.floor(mode.game.mapHeight / 2) }
}

export function createActor (mode, pos, actorClass, params) {
  const {range, character, name, color, background, passable = false, remainAfterUse = false} = params;
  const piece = new actorClass({
    game: mode.game,
    passable,
    pos: { x: pos.x, y: pos.y },
    renderer: {
      character,
      color,
      background,
      sprite: character
    },
    traversableTiles: ['WATER'],
    name,
    speed: 1000,
    energy: 0,
    range,
    damageToSelf: 1,
    remainAfterUse,
    ...params,
  })

  mode.game.placeActorOnMap(piece)
}

export function createFurniture (mode, pos, params) {
  createActor(mode, pos, MovingWall, params)
}

export function createThrowable (mode, pos, params) {
  createActor(mode, pos, DirectionalProjectile, params)
}

export function generate (mode, pos, shape, params, createFunction = createFurniture) {
  const positions = Helper.getPositionsFromStructure(shape, pos);
  positions.forEach((position) => {
    let tile = mode.game.map[Helper.coordsToString(position)];
    if (!tile) return false;
    createFunction(mode, position, params);
  });
}
export const ACTOR_PARAMS = {
  operating_table: { range: 5, character: '#', name: 'operating table', color: COLORS.light, background: COLORS.dark_accent, passable: true, defense: 1, remainAfterUse: true },
  table: { range: 2, character: 'T', name: 'table', color: COLORS.light, background: COLORS.dark, defense: 1, remainAfterUse: true },
  cubicle_wall: { range: 2, character: '▒', name: 'cubicle wall', color: COLORS.light_mid, background: COLORS.dark, defense: 1, remainAfterUse: true },
  dead_body: { range: 0, character: 's', name: 'dead scientist', color: COLORS.light, background: "#833139", durability: 3, bloodSpatterOnHit: true, remainAfterUse: true },
  bottle: { range: 3, character: '!', name: 'glass vial', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1 },
  scalpel: { range: 3, character: '|', name: 'scalpel', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1, attackDamage: 1 },
  scissors: { range: 3, character: '^', name: 'scissors', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1, attackDamage: 1 },
  pliers: { range: 3, character: ']', name: 'pliers', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1 },
}