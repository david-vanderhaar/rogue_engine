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

export default function GenerateConstructionMap (
  mode,
  {
    CHANCE_OF_WALL_CONSTRUCTION,
    CHANCE_OF_WINDOW_REPLACMENT,
    CHANCE_OF_DRY_WALL,
    INNER_MAP_DIMENSIONS,
    NUMBER_OF_ITEMS,
    NUMBER_OF_EXPLOSIVES,
    WAVES,
  }
) {
  refreshColors({fg: COLORS.dark_yellow})
  // refreshColors({fg: COLORS.blue_mid})
  addInnerMostTileTypeFilled(mode, 'WALL', 0)
  addInnerMostTileTypeFilled(mode, 'FREE_FALL', 3)
  addInnerMostTileTypeFilled(mode, 'WALL', 5)
  addInnerMostTileTypeFilled(mode, 'GROUND', 6)
  mode.game.initializeMapTiles();

  
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

  startMissionManager(mode, WAVES)
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

function startMissionManager(mode, WAVES) {
  const player = mode.game.getFirstPlayer();
  const waveMissions = WAVES.map((wave, index) => {
    const waveCount = Helper.getRandomIntInclusive(wave.min, wave.max)
    let waveName = wave?.name || `Enemy Wave [${index + 1}]`
    if ((index + 1) === WAVES.length) waveName = 'Final Wave'
    const waveDescription = wave?.description || 'Eliminate all enemies.'
    return new Mission({
      name: waveName,
      description: waveDescription,
      timesToComplete: waveCount,
      eventToComplete: `OPPONENT:destroy`,
      onTrigger: () => {
        Helper.range(waveCount).forEach((index) => {
          const randomPosition = Helper.getRandomInArray(MapHelper.getEmptyGroundTileKeys(mode.game))
          const pos = Helper.stringToCoords(randomPosition)
          const enemyKey = Helper.getRandomInArray(wave.enemyKeys)
          EnemyActors.addByKey(mode, pos, enemyKey)
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
    })
  })

  mode.initializeMissionManager({
    missions: [
      ...waveMissions,
      new Mission({
        name: 'Escape the Building',
        description: 'Proceed to the elevator at the top, center spaces and escape this place.',
        timesToComplete: 1,
        eventToComplete: `${player?.id}:move:tileType:ELEVATOR`,
      }),
    ],
  })
}
