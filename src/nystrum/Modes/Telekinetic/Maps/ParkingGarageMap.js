import * as ROT from 'rot-js';
import { COLORS, refreshColors } from "../theme";
import { ACTOR_PARAMS, addInnerMostTileTypeFilled, centerPosition, createExplosiveThrowable, createThrowable, generate, placePlayerInCenter } from "./telekeneticMapHelper";
import { SHAPES } from "../../../Maps/coverGenerator";
import * as MapHelper from '../../../Maps/helper';
import * as Helper from '../../../../helper';
import * as EnemyActors from '../Actors/Enemies';
import Mission from "../../../Mission/Mission";
import SpatterEmitter from "../../../Engine/Particle/Emitters/spatterEmitter";

const INNER_MAP_DIMENSIONS = {x: 4, mx: 33, y: 5, my: 20}
const CHANCE_OF_CONCRETE_BARRIER = 0.7
const NUMBER_OF_POOLS = {min: 1, max: 4}
const SIZE_OF_POOLS = {min: 2, max: 6}
const NUMBER_OF_ITEMS = {min: 10, max: 40}
const NUMBER_OF_EXPLOSIVES = {min: 2, max: 6}
const NUMBER_OF_FIRST_WAVE = {min: 2, max: 3}
const NUMBER_OF_SECOND_WAVE = {min: 3, max: 6}
const NUMBER_OF_THIRD_WAVE = {min: 3, max: 6}

export default function GenerateParkingGarageMap (mode) {
  refreshColors({fg: COLORS.dark_accent})
  addInnerMostTileTypeFilled(mode, 'WALL', 0)
  addInnerMostTileTypeFilled(mode, 'GROUND', 4)
  mode.game.initializeMapTiles();

  
  // random water puddles, player can walk on at cost of mind, enemies cannot
  // add a random number of blobs of random size of WATER
  // using addTileZone
  for (let i = NUMBER_OF_POOLS.min; i < NUMBER_OF_POOLS.max; i++) {
    let size = Helper.getRandomInt(SIZE_OF_POOLS.min, SIZE_OF_POOLS.max);
    let x = Helper.getRandomInt(INNER_MAP_DIMENSIONS.x + 2, INNER_MAP_DIMENSIONS.mx - 2);
    let y = Helper.getRandomInt(INNER_MAP_DIMENSIONS.y + 2, INNER_MAP_DIMENSIONS.my - 2);
    
    MapHelper.addTileZoneFilledCircle(
      { x, y },
      size,
      'WATER',
    );
  }

  // concrete barriers in random Ls and lines
  // find all GROUND
    // for each, find neighbors
      // if any neighbor is FREE_FALL AND no entity in GROUND TILE
        // add dry wall 
  MapHelper.getEmptyGroundTileKeys(mode.game).forEach((key) => {
    const pos = Helper.stringToCoords(key)
    if (pos.x < INNER_MAP_DIMENSIONS.x || pos.x >= INNER_MAP_DIMENSIONS.mx || pos.y < INNER_MAP_DIMENSIONS.y || pos.y >= INNER_MAP_DIMENSIONS.my) return;

    const neighbs = Helper.getNeighboringTiles(mode.game.map, pos)
    const hasFreeFallNeighbs = neighbs.find((tile) => tile.type == 'WATER')
    if (hasFreeFallNeighbs && Helper.getXChance(CHANCE_OF_CONCRETE_BARRIER)) {
      generate(mode, pos, SHAPES.point, ACTOR_PARAMS.concrete_barrier)
    }
  })

  // place construnction items (more damage)
  const numberOfItems = Helper.getRandomIntInclusive(NUMBER_OF_ITEMS.min, NUMBER_OF_ITEMS.max)
  Helper.getNumberOfItemsInArray(numberOfItems, MapHelper.getEmptyGroundTileKeys(mode.game)).forEach((key) => {
    const pos = Helper.stringToCoords(key)
    const params = Helper.getRandomInArray([
      ACTOR_PARAMS.hammer,
      ACTOR_PARAMS.nail_pile,
      ACTOR_PARAMS.two_by_four,
      ACTOR_PARAMS.metal_sheet,
      ACTOR_PARAMS.saw_blade,
      ACTOR_PARAMS.car,
      ACTOR_PARAMS.cone,
      ACTOR_PARAMS.pipe,
    ])
    generate(mode, pos, SHAPES.point, params, createThrowable)
  })

  const numberOfExplosiveItems = Helper.getRandomIntInclusive(NUMBER_OF_EXPLOSIVES.min, NUMBER_OF_EXPLOSIVES.max)
  Helper.getNumberOfItemsInArray(numberOfExplosiveItems, MapHelper.getEmptyGroundTileKeys(mode.game)).forEach((key) => {
    const pos = Helper.stringToCoords(key)
    const params = Helper.getRandomInArray([
      ACTOR_PARAMS.gas_can,
      ACTOR_PARAMS.gas_tank,
    ])
    generate(mode, pos, SHAPES.point, params, createExplosiveThrowable)
  })

  // whole top row should be GROUND
  for (let x = INNER_MAP_DIMENSIONS.x; x < INNER_MAP_DIMENSIONS.mx - 4; x++) {
    MapHelper.addTileToMap({map: mode.game.map, key: `${x},${INNER_MAP_DIMENSIONS.y + 1}`, tileKey: mode.tileKey, tileType: 'GROUND'})
  }

  // place elevator doors
  MapHelper.addTileToMap({map: mode.game.map, key: `17,5`, tileKey: mode.tileKey, tileType: 'ELEVATOR'})
  MapHelper.addTileToMap({map: mode.game.map, key: `18,5`, tileKey: mode.tileKey, tileType: 'ELEVATOR'})
  MapHelper.addTileToMap({map: mode.game.map, key: `17,4`, tileKey: mode.tileKey, tileType: 'WALL'})
  MapHelper.addTileToMap({map: mode.game.map, key: `18,4`, tileKey: mode.tileKey, tileType: 'WALL'})
  MapHelper.addTileToMap({map: mode.game.map, key: `16,4`, tileKey: mode.tileKey, tileType: 'WALL'})
  MapHelper.addTileToMap({map: mode.game.map, key: `19,4`, tileKey: mode.tileKey, tileType: 'WALL'})

  // placePlayer In elevator
  mode.getPlayer().move({x: 17, y: 5})
  startMissionManager(mode)
}

function startMissionManager(mode) {
  const player = mode.game.getFirstPlayer();
  const firstWaveCount = Helper.getRandomIntInclusive(NUMBER_OF_FIRST_WAVE.min, NUMBER_OF_FIRST_WAVE.max)
  const secondWaveCount = Helper.getRandomIntInclusive(NUMBER_OF_SECOND_WAVE.min, NUMBER_OF_SECOND_WAVE.max)
  const thirdWaveCount = Helper.getRandomIntInclusive(NUMBER_OF_THIRD_WAVE.min, NUMBER_OF_THIRD_WAVE.max)

  mode.initializeMissionManager({
    missions: [
      new Mission({
        name: 'First Wave',
        description: 'Even these construction junkies area after me? Eliminate Them.',
        timesToComplete: firstWaveCount,
        eventToComplete: `construction junkie:destroy`,
        onTrigger: () => {
          Helper.range(firstWaveCount).forEach((index) => {
            const randomPosition = Helper.getRandomInArray(MapHelper.getEmptyGroundTileKeys(mode.game))
            const pos = Helper.stringToCoords(randomPosition)
            
            EnemyActors.addConstructionJunkie(mode, pos)
            SpatterEmitter({
              game: mode.game,
              fromPosition: pos,
              spatterAmount: 0.8,
              spatterRadius: 3,
              animationTimeStep: 0.6,
              transfersBackground: false,
              spatterColors: [COLORS.blue_dark, COLORS.dark_accent, COLORS.blue_light],
            }).start()
          })
        }
      }),
      new Mission({
        name: 'Second Wave',
        description: 'What? they have drones? Take them out.',
        timesToComplete: secondWaveCount,
        eventToComplete: `drone:destroy`,
        onTrigger: () => {
          Helper.range(secondWaveCount).forEach((index) => {
            const randomPosition = Helper.getRandomInArray(MapHelper.getEmptyGroundTileKeys(mode.game))
            const pos = Helper.stringToCoords(randomPosition)
            
            EnemyActors.addDrone(mode, pos)
            SpatterEmitter({
              game: mode.game,
              fromPosition: pos,
              spatterAmount: 0.8,
              spatterRadius: 3,
              animationTimeStep: 0.6,
              transfersBackground: false,
              spatterColors: [COLORS.blue_dark, COLORS.dark_accent, COLORS.blue_light],
            }).start()
          })
        }
      }),
      new Mission({
        name: 'Final Wave',
        description: '*sigh* They don\'t realize my power is growing. Eliminate them.',
        timesToComplete: thirdWaveCount,
        eventToComplete: `OPPONENT:destroy`,
        onTrigger: () => {
          Helper.range(thirdWaveCount).forEach((index) => {
            const randomPosition = Helper.getRandomInArray(MapHelper.getEmptyGroundTileKeys(mode.game))
            const pos = Helper.stringToCoords(randomPosition)
            
            EnemyActors.addRandom(mode, pos)
            SpatterEmitter({
              game: mode.game,
              fromPosition: pos,
              spatterAmount: 0.8,
              spatterRadius: 3,
              animationTimeStep: 0.6,
              transfersBackground: false,
              spatterColors: [COLORS.blue_dark, COLORS.dark_accent, COLORS.blue_light],
            }).start()
          })
        }
      }),
      new Mission({
        name: 'Escape the Building',
        description: 'Proceed to the elevator and escape this place.',
        timesToComplete: 1,
        eventToComplete: `${player?.id}:move:tileType:ELEVATOR`,
      }),
    ],
  })
}