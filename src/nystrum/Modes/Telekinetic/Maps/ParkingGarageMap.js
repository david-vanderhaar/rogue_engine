import * as ROT from 'rot-js';
import { COLORS, refreshColors } from "../theme";
import { ACTOR_PARAMS, addInnerMostTileTypeFilled, centerPosition, createExplosiveThrowable, createThrowable, generate, placePlayerInCenter } from "./telekeneticMapHelper";
import { SHAPES } from "../../../Maps/coverGenerator";
import * as MapHelper from '../../../Maps/helper';
import * as Helper from '../../../../helper';
import * as EnemyActors from '../Actors/Enemies';
import Mission from "../../../Mission/Mission";
import SpatterEmitter from "../../../Engine/Particle/Emitters/spatterEmitter";
import { SOUND_MANAGER, SOUNDS } from '../sounds';

export default function GenerateParkingGarageMap (
  mode,
  {
    INNER_MAP_DIMENSIONS,
    CHANCE_OF_CONCRETE_BARRIER,
    NUMBER_OF_POOLS,
    SIZE_OF_POOLS,
    NUMBER_OF_ITEMS,
    NUMBER_OF_EXPLOSIVES,
    WAVES,
  }
) {
  SOUND_MANAGER.fadeInSound(SOUNDS.level_parking)
  refreshColors({fg: COLORS.dark_accent_mid})
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
  startMissionManager(mode, WAVES)
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
    onComplete: () => SOUND_MANAGER.fadeOutSound(SOUNDS.level_parking)
  })
}