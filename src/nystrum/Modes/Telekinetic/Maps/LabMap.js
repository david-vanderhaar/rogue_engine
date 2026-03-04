import { DirectionalProjectile, MovingWall } from "../../../Entities";
import { abstractGenerate, generateCoverBlock, SHAPES } from "../../../Maps/coverGenerator";
import * as MapHelper from '../../../Maps/helper';
import { COLORS, refreshColors } from "../theme";
import * as Helper from '../../../../helper';
import Mission from "../../../Mission/Mission";
import * as EnemyActors from '../Actors/Enemies';
import gradientRadialEmitter from "../../../Engine/Particle/Emitters/gradientRadialEmitter";
import SpatterEmitter from "../../../Engine/Particle/Emitters/spatterEmitter";

export default function GenerateLabMap (mode) {
  // COLORS.fg_override = COLORS.light
  // refreshColors({fg: COLORS.light})
  mode.createEmptyLevel();
  mode.game.initializeMapTiles();
  mode.addWalls(6);

  const CENTER_POSITION = centerPosition(mode);

  // place operating table in center
  generate(mode, {x: CENTER_POSITION.x - 1, y: CENTER_POSITION.y - 1}, SHAPES.horizontalLine, ACTOR_PARAMS.operating_table)
  // place player in center
  placePlayerInCenter(mode);
  // place table near center
  generate(mode, { x: CENTER_POSITION.x + 3, y: CENTER_POSITION.y }, SHAPES.southWestVerticalL, ACTOR_PARAMS.table)
  generate(mode, { x: CENTER_POSITION.x - 2, y: CENTER_POSITION.y }, SHAPES.southEastVerticalL, ACTOR_PARAMS.table)
  // place medical equipment around room
  Helper.getNumberOfItemsInArray(10, MapHelper.getEmptyGroundTileKeys(mode.game)).forEach((key) => {
    const pos = Helper.stringToCoords(key)
    const params = Helper.getRandomInArray([ACTOR_PARAMS.bottle, ACTOR_PARAMS.scalpel, ACTOR_PARAMS.scissors, ACTOR_PARAMS.pliers])
    // const params = Helper.getRandomInArray([ACTOR_PARAMS.scalpel, ACTOR_PARAMS.scissors, ACTOR_PARAMS.pliers])
    generate(mode, pos, SHAPES.point, params, createThrowable)
  })
  // place 3 dead scientists around room (with blood stains)  
  const keys = Helper.getNumberOfItemsInArray(2, MapHelper.getEmptyGroundTileKeys(mode.game))
  keys.forEach((key) => {
    const pos = Helper.stringToCoords(key)
    generate(mode, pos, SHAPES.point, ACTOR_PARAMS.dead_body)
  })

  // place elevator doors
  MapHelper.addTileToMap({map: mode.game.map, key: `17,6`, tileKey: mode.tileKey, tileType: 'ELEVATOR'})
  MapHelper.addTileToMap({map: mode.game.map, key: `18,6`, tileKey: mode.tileKey, tileType: 'ELEVATOR'})

  // add enemie after certain number of missions or time has passed
  startMissionManager(mode);
}

function startMissionManager(mode) {
  const player = mode.game.getFirstPlayer();
  // const opp = mode.getFirstEnemyActor();


  const firstMission = new Mission({
    name: 'Throwing Practice',
    description: 'Your body is too weak to fight, but your mind is sharp. \nUse your telekinetic powers to throw an object. \nPress "f" to activate telekinesis, select an object within range, then select a target direction.',
    timesToComplete: 2,
    eventToComplete: `${player?.id}:apply_status_effect_thrown`,
  })

  const secondMission = new Mission({
    name: 'More Throwing Practice',
    description: 'Some objects break when thrown, heavier objects like furniture can be thrown multiple times. Try throwning a table.',
    timesToComplete: 2,
    eventToComplete: `${player?.id}:apply_status_effect_thrown:table`,
  })

  const thirdMission = new Mission({
    name: 'First Blood',
    description: 'A guard must have heard you. Use your telekinesis to attack them. Throw a scalpel or pair of scissors at them to cause damage from range.',
    timesToComplete: 2,
    eventToComplete: `attack:security guard`,
    onTrigger: () => {
      // mode.addEnemies(1, 'addsecurityGuard')
      EnemyActors.addsecurityGuard(mode, { x: 17, y: 6 })
      SpatterEmitter({
        game: mode.game,
        fromPosition: { x: 17, y: 6 },
        spatterAmount: 0.8,
        spatterRadius: 3,
        animationTimeStep: 0.6,
        transfersBackground: false,
        spatterColors: [COLORS.blue_dark, COLORS.dark_accent, COLORS.blue_light],
      }).start()
    }
  })

  const fourthMission = new Mission({
    name: 'Escape the Lab',
    description: 'Proceed to the elevator and escape this place.',
    timesToComplete: 1,
    eventToComplete: `${player?.id}:move:tileType:ELEVATOR`,
  })

  mode.initializeMissionManager({
    missions: [
      firstMission,
      secondMission,
      thirdMission,
      fourthMission,
    ],
  })
}

function placePlayerInCenter(mode) {
  const player = mode.getPlayer();
  player.move(centerPosition(mode));
}

function centerPosition (mode) {
  return  { x: Math.floor(mode.game.mapWidth / 2), y: Math.floor(mode.game.mapHeight / 2) }
}

function createActor (mode, pos, actorClass, params) {
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

function createFurniture (mode, pos, params) {
  createActor(mode, pos, MovingWall, params)
}

function createThrowable (mode, pos, params) {
  createActor(mode, pos, DirectionalProjectile, params)
}

export const generate = (mode, pos, shape, params, createFunction = createFurniture) => {
  const positions = Helper.getPositionsFromStructure(shape, pos);
  positions.forEach((position) => {
    let tile = mode.game.map[Helper.coordsToString(position)];
    if (!tile) return false;
    createFunction(mode, position, params);
  });
}

const ACTOR_PARAMS = {
  operating_table: { range: 5, character: '#', name: 'operating table', color: COLORS.light, background: COLORS.dark_accent, passable: true, defense: 1, remainAfterUse: true },
  table: { range: 2, character: 'T', name: 'table', color: COLORS.light, background: COLORS.dark, defense: 1, remainAfterUse: true },
  dead_body: { range: 0, character: 's', name: 'dead scientist', color: COLORS.light, background: "#833139", durability: 3, bloodSpatterOnHit: true, remainAfterUse: true },
  bottle: { range: 3, character: '!', name: 'glass vial', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1 },
  scalpel: { range: 3, character: '|', name: 'scalpel', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1, attackDamage: 1 },
  scissors: { range: 3, character: '^', name: 'scissors', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1, attackDamage: 1 },
  pliers: { range: 3, character: ']', name: 'pliers', color: COLORS.white, background: COLORS.dark, passable: true, durability: 1 },
}
