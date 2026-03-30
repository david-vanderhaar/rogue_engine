import { add } from 'lodash';
import * as MapHelper from '../../../Maps/helper';
import { COLORS } from '../theme';
import * as Helper from '../../../../helper';
import { DirectionalProjectile, Grenade, MovingWall } from '../../../Entities';
import { SOUNDS } from '../sounds';

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
  const {range,
    character,
    name,
    color,
    background,
    passable = false,
    remainAfterUse = false,
    meleeSounds = [
      SOUNDS.small_object_melee_01,
      SOUNDS.small_object_melee_02,
      SOUNDS.small_object_melee_03,
      SOUNDS.small_object_melee_04,
      SOUNDS.small_object_melee_05,
      SOUNDS.small_object_melee_06,
    ],
    onMove = () => null,
  } = params;

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
    meleeSounds,
    onMove,
    ...params,
  })

  mode.game.placeActorOnMap(piece)
}

export function createFurniture (mode, pos, params) {
  const sound = Helper.getRandomInArray([
    SOUNDS.object_slide_01,
    SOUNDS.object_slide_02,
    SOUNDS.object_slide_03,
  ])

  const onMove = () => {
    if (!sound.playing()) sound.play()
  }

  createActor(mode, pos, MovingWall, {...params, onMove})
}

export function createThrowable (mode, pos, params) {
  const sound = Helper.getRandomInArray([
    SOUNDS.whoosh_01,
    SOUNDS.whoosh_02,
    SOUNDS.whoosh_03,
  ])

  const onMove = () => {
    if (!sound.playing()) sound.play()
  }

  createActor(mode, pos, DirectionalProjectile, {...params, onMove})
}

export function createExplosiveThrowable (mode, pos, params) {
  createActor(mode, pos, Grenade, params)
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
  window_wall: { range: 4, character: '░', name: 'window wall', color: COLORS.white, background: COLORS.dark, defense: 0, remainAfterUse: false, meleeSounds: [SOUNDS.glass_object_melee_01, SOUNDS.glass_object_melee_02, SOUNDS.glass_object_melee_03, SOUNDS.glass_object_melee_04, SOUNDS.glass_object_melee_05, SOUNDS.glass_object_melee_06]},
  dry_wall: { range: 4, character: '░', name: 'dry wall', color: COLORS.mid_yellow, background: COLORS.dark, defense: 0, remainAfterUse: false, meleeSounds: [SOUNDS.wooden_object_melee_01, SOUNDS.wooden_object_melee_02, SOUNDS.wooden_object_melee_03, SOUNDS.wooden_object_melee_04, SOUNDS.wooden_object_melee_05]},
  concrete_barrier: { range: 4, character: '█', name: 'concrete barrier', color: COLORS.kiba, background: COLORS.dark, defense: 2, remainAfterUse: true, attackDamage: 1 },
  chair: { range: 4, character: 'h', name: 'chair', color: COLORS.blue_mid, background: COLORS.dark, defense: 0, remainAfterUse: false, meleeSounds: [SOUNDS.wooden_object_melee_01, SOUNDS.wooden_object_melee_02, SOUNDS.wooden_object_melee_03, SOUNDS.wooden_object_melee_04, SOUNDS.wooden_object_melee_05] },
  desk: { range: 1, character: 'T', name: 'desk', color: COLORS.blue_mid, background: COLORS.dark, defense: 0, remainAfterUse: false, meleeSounds: [SOUNDS.wooden_object_melee_01, SOUNDS.wooden_object_melee_02, SOUNDS.wooden_object_melee_03, SOUNDS.wooden_object_melee_04, SOUNDS.wooden_object_melee_05] },
  // LAB ITEMS
  dead_body: { range: 0, character: 's', name: 'dead scientist', color: COLORS.red, background: "#833139", durability: 3, bloodSpatterOnHit: true, remainAfterUse: true },
  bottle: { range: 3, character: '!', name: 'glass vial', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1 },
  scalpel: { range: 3, character: '|', name: 'scalpel', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1, attackDamage: 1 },
  scissors: { range: 3, character: '^', name: 'scissors', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1, attackDamage: 1 },
  pliers: { range: 3, character: ']', name: 'pliers', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1 },
  // OFFICE ITEMS 
  stapler: { range: 3, character: ']', name: 'stapler', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1 },
  mug: { range: 3, character: 'u', name: 'mug', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1 },
  pencil: { range: 3, character: 'i', name: 'pencil', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1 },
  phone: { range: 3, character: '[', name: 'phone', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1 },
  // CONTRUCTION ITEMS 
  hammer: { range: 1, character: 'p', name: 'hammer', color: COLORS.light, background: COLORS.dark, passable: true, durability: 2, attackDamage: 2,  remainAfterUse: true, meleeSounds: [SOUNDS.heavy_object_melee_01, SOUNDS.heavy_object_melee_02, SOUNDS.heavy_object_melee_03]}, 
  helmet: { range: 1, character: 'n', name: 'helmet', color: COLORS.light, background: COLORS.dark, passable: true, durability: 2, remainAfterUse: true },
  metal_sheet: { range: 1, character: '#', name: 'metal sheet', color: COLORS.light, background: COLORS.dark, passable: true, durability: 4, remainAfterUse: true, meleeSounds: [SOUNDS.heavy_object_melee_01, SOUNDS.heavy_object_melee_02, SOUNDS.heavy_object_melee_03] },
  saw_blade: { range: 1, character: '*', name: 'saw blade', color: COLORS.light, background: COLORS.dark, passable: true, durability: 3, attackDamage: 3, remainAfterUse: true, meleeSounds: [SOUNDS.heavy_object_melee_01, SOUNDS.heavy_object_melee_02, SOUNDS.heavy_object_melee_03] },
  nail_pile: { range: 1, character: '=', name: 'nail pile', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1 },
  two_by_four: { range: 1, character: ']', name: 'two by four', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1, attackDamage: 2, meleeSounds: [SOUNDS.wooden_object_melee_01, SOUNDS.wooden_object_melee_02, SOUNDS.wooden_object_melee_03, SOUNDS.wooden_object_melee_04, SOUNDS.wooden_object_melee_05] },
  four_by_eight: { range: 1, character: ']]', name: 'four by eight', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1, attackDamage: 4, meleeSounds: [SOUNDS.wooden_object_melee_01, SOUNDS.wooden_object_melee_02, SOUNDS.wooden_object_melee_03, SOUNDS.wooden_object_melee_04, SOUNDS.wooden_object_melee_05] },
  // PARKING GARAGE ITEMS
  car: { range: 1, character: '»»', name: 'car', color: COLORS.light, background: COLORS.dark, passable: false, durability: 10, attackDamage: 1, remainAfterUse: true, meleeSounds: [SOUNDS.heavy_object_melee_01, SOUNDS.heavy_object_melee_02, SOUNDS.heavy_object_melee_03] },
  cone: { range: 1, character: '^', name: 'traffic cone', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1 },
  pipe: { range: 1, character: ')', name: 'pipe', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1, attackDamage: 2, meleeSounds: [SOUNDS.heavy_object_melee_01, SOUNDS.heavy_object_melee_02, SOUNDS.heavy_object_melee_03] },
  
  // EXPLOSIVES
  fire_extinguisher: { range: 3, character: '%', name: 'fire extinguisher', color: COLORS.red, background: COLORS.dark, passable: true, durability: 1, flammability: 0, explosivity: 2, attackDamage: 3 },
  gas_can: { range: 3, character: 'õ', name: 'gas can', color: COLORS.white, background: COLORS.red, passable: true, durability: 1, flammability: 1, explosivity: 2, attackDamage: 3 },
  gas_tank: { range: 3, character: 'Õ', name: 'gas tank', color: COLORS.white, background: COLORS.red, passable: false, durability: 1, flammability: 1, explosivity: 4, attackDamage: 5 },
}