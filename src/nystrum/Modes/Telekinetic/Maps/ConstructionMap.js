import * as ROT from 'rot-js';
import { COLORS, refreshColors } from "../theme";
import { ACTOR_PARAMS, addInnerMostTileTypeFilled, centerPosition, createExplosiveThrowable, createThrowable, generate, placePlayerInCenter } from "./telekeneticMapHelper";
import { SHAPES } from "../../../Maps/coverGenerator";
import * as MapHelper from '../../../Maps/helper';
import * as Helper from '../../../../helper';
import * as EnemyActors from '../Actors/Enemies';
import Mission from "../../../Mission/Mission";
import SpatterEmitter from "../../../Engine/Particle/Emitters/spatterEmitter";
import { DIRECTIONS } from "../../../constants";

const CHANCE_OF_WALL_CONSTRUCTION = 0.35
const CHANCE_OF_WINDOW_REPLACMENT = 0.25
const CHANCE_OF_DRY_WALL = 0.3
const INNER_MAP_DIMENSIONS = {x: 6, mx: 29, y: 5, my: 20}
const NUMBER_OF_ITEMS = {min: 10, max: 40}
const NUMBER_OF_EXPLOSIVES = {min: 2, max: 6}
const NUMBER_OF_FIRST_WAVE = {min: 2, max: 3}
const NUMBER_OF_SECOND_WAVE = {min: 3, max: 6}
const NUMBER_OF_THIRD_WAVE = {min: 3, max: 6}

export default function GenerateConstructionMap (mode) {
  refreshColors({fg: COLORS.blue_dark})
  addInnerMostTileTypeFilled(mode, 'FREE_FALL', 0)
  addInnerMostTileTypeFilled(mode, 'WALL', 5)
  addInnerMostTileTypeFilled(mode, 'GROUND', 6)
  mode.game.initializeMapTiles();

  
  const CENTER_POSITION = centerPosition(mode);
  generateHoles(mode, {x: 6, y: 6}, 23, 14)
  // ranomd pars of outer wall missing
  // random windows on outer wall
  const nUnderConstruction = Helper.getXChance(CHANCE_OF_WALL_CONSTRUCTION)
  const sUnderConstruction = Helper.getXChance(CHANCE_OF_WALL_CONSTRUCTION)
  const eUnderConstruction = Helper.getXChance(CHANCE_OF_WALL_CONSTRUCTION)
  const wUnderConstruction = Helper.getXChance(CHANCE_OF_WALL_CONSTRUCTION)
  for (let x = 5; x < 25; x++) {
    // north wall windows
    if (nUnderConstruction) {
      if ([16, 17, 18, 19].includes(x)) continue; // skip elevator doors
      MapHelper.addTileToMap({map: mode.game.map, key: `${x},5`, tileKey: mode.tileKey, tileType: 'GROUND'})
      if (Helper.getXChance(CHANCE_OF_WINDOW_REPLACMENT)) {
        generate(mode, { x, y: 5 }, SHAPES.point, ACTOR_PARAMS.window_wall, createThrowable)
      }
    }
    // south wall windows
    if (sUnderConstruction) {
      MapHelper.addTileToMap({map: mode.game.map, key: `${x},20`, tileKey: mode.tileKey, tileType: 'GROUND'})
      if (Helper.getXChance(CHANCE_OF_WINDOW_REPLACMENT)) {
        generate(mode, { x, y: 20 }, SHAPES.point, ACTOR_PARAMS.window_wall, createThrowable)
      }
    }
  }

  for (let y = 7; y < 18; y++) {
    // west wall windows
    if (wUnderConstruction) {
      MapHelper.addTileToMap({map: mode.game.map, key: `5,${y}`, tileKey: mode.tileKey, tileType: 'GROUND'})
      if (Helper.getXChance(CHANCE_OF_WINDOW_REPLACMENT)) {
        generate(mode, { x: 5, y }, SHAPES.point, ACTOR_PARAMS.window_wall, createThrowable)
      }
    }
    // east wall windows
    if (eUnderConstruction) {
      MapHelper.addTileToMap({map: mode.game.map, key: `29,${y}`, tileKey: mode.tileKey, tileType: 'GROUND'})
      if (Helper.getXChance(CHANCE_OF_WINDOW_REPLACMENT)) {
        generate(mode, { x: 29, y }, SHAPES.point, ACTOR_PARAMS.window_wall, createThrowable)
      }
    }
  }

  // drywall walls in random Ls and lines
  // find all GROUND
    // for each, find neighbors
      // if any neighbor is FREE_FALL AND no entity in GROUND TILE
        // add dry wall 
  MapHelper.getEmptyGroundTileKeys(mode.game).forEach((key) => {
    const pos = Helper.stringToCoords(key)
    if (pos.x < 6 || pos.x >= 29 || pos.y < 5 || pos.y >= 20) return;

    const neighbs = Helper.getNeighboringTiles(mode.game.map, pos)
    const hasFreeFallNeighbs = neighbs.find((tile) => tile.type == 'FREE_FALL')
    if (hasFreeFallNeighbs && Helper.getXChance(CHANCE_OF_DRY_WALL)) {
      generate(mode, pos, SHAPES.point, ACTOR_PARAMS.dry_wall)
    }
  })
  
  // random water puddles, player can walk on at cost of mind, enemies cannot
  // add a random number of blobs of random size of WATER
  // using addTileZone
  for (let i = 0; i < 3; i++) {
    let size = Helper.getRandomInt(2, 3);
    let x = Helper.getRandomInt(INNER_MAP_DIMENSIONS.x + 2, INNER_MAP_DIMENSIONS.mx - 2);
    let y = Helper.getRandomInt(INNER_MAP_DIMENSIONS.y + 2, INNER_MAP_DIMENSIONS.my - 2);
    
    MapHelper.addTileZoneFilledCircle(
      { x, y },
      size,
      'WATER',
    );
  }

  // place construnction items (more damage)
  const numberOfItems = Helper.getRandomIntInclusive(NUMBER_OF_ITEMS.min, NUMBER_OF_ITEMS.max)
  Helper.getNumberOfItemsInArray(numberOfItems, MapHelper.getEmptyGroundTileKeys(mode.game)).forEach((key) => {
    const pos = Helper.stringToCoords(key)
    const params = Helper.getRandomInArray([
      ACTOR_PARAMS.hammer,
      ACTOR_PARAMS.nail_pile,
      ACTOR_PARAMS.helmet,
      ACTOR_PARAMS.two_by_four,
      ACTOR_PARAMS.four_by_eight,
      ACTOR_PARAMS.metal_sheet,
      ACTOR_PARAMS.saw_blade,
    ])
    generate(mode, pos, SHAPES.point, params, createThrowable)
  })

  const numberOfExplosiveItems = Helper.getRandomIntInclusive(NUMBER_OF_EXPLOSIVES.min, NUMBER_OF_EXPLOSIVES.max)
  Helper.getNumberOfItemsInArray(numberOfExplosiveItems, MapHelper.getEmptyGroundTileKeys(mode.game)).forEach((key) => {
    const pos = Helper.stringToCoords(key)
    generate(mode, pos, SHAPES.point, ACTOR_PARAMS.fire_extinguisher, createExplosiveThrowable)
  })

  // place elevator doors
  MapHelper.addTileToMap({map: mode.game.map, key: `17,5`, tileKey: mode.tileKey, tileType: 'ELEVATOR'})
  MapHelper.addTileToMap({map: mode.game.map, key: `18,5`, tileKey: mode.tileKey, tileType: 'ELEVATOR'})
  MapHelper.addTileToMap({map: mode.game.map, key: `17,4`, tileKey: mode.tileKey, tileType: 'WALL'})
  MapHelper.addTileToMap({map: mode.game.map, key: `18,4`, tileKey: mode.tileKey, tileType: 'WALL'})
  MapHelper.addTileToMap({map: mode.game.map, key: `16,4`, tileKey: mode.tileKey, tileType: 'WALL'})
  MapHelper.addTileToMap({map: mode.game.map, key: `19,4`, tileKey: mode.tileKey, tileType: 'WALL'})
  
  // whole top row should be GROUND
  for (let x = 6; x < 25; x++) {
    MapHelper.addTileToMap({map: mode.game.map, key: `${x},6`, tileKey: mode.tileKey, tileType: 'GROUND'})
  }

  // placePlayer In elevator
  mode.getPlayer().move({x: 17, y: 5})

  startMissionManager(mode)
}

function generateHoles (mode, offset, width = 24, height = 16) {
  const digger = new ROT.Map.Cellular(width, height);
  digger.randomize(0.4) // the higher this percentage, the hight the difficulty due to more tall grass
  let digCallback = function (x, y, value) {      
    let key = `${x + offset.x},${y + offset.y}`
    // let type = Helper.getRandomInArray(['BURNT', 'BURNT'])
    let type = 'GROUND'
    if (value) type = 'FREE_FALL';
    MapHelper.addTileToMap({map: mode.game.map, key, tileKey: mode.game.tileKey, tileType: type})
  }
  digger.create(digCallback.bind(this));
  digger.connect(digCallback.bind(this))
}

function startMissionManager(mode) {
  const player = mode.game.getFirstPlayer();
  const firstWaveCount = Helper.getRandomIntInclusive(NUMBER_OF_FIRST_WAVE.min, NUMBER_OF_FIRST_WAVE.max)
  const secondWaveCount = Helper.getRandomIntInclusive(NUMBER_OF_SECOND_WAVE.min, NUMBER_OF_SECOND_WAVE.max)
  const thirdWaveCount = Helper.getRandomIntInclusive(NUMBER_OF_THIRD_WAVE.min, NUMBER_OF_THIRD_WAVE.max)

  mode.initializeMissionManager({
    missions: [
      new Mission({
        name: 'Don\'t Fall',
        description: 'Proceed to dark spaced tile, where the floor fell away. See what happens.',
        timesToComplete: 1,
        eventToComplete: `${player?.id}:move:tileType:FREE_FALL`,
      }),
      new Mission({
        name: 'Don\'t Panic',
        description: 'You have a few turns before you fall to your death. Go ahead and climb back out of there.',
        timesToComplete: 1,
        eventToComplete: `${player?.id}:move:tileType:GROUND`,
      }),
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
