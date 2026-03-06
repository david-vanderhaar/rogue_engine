import { COLORS, refreshColors } from "../theme";
import { ACTOR_PARAMS, addInnerMostTileTypeFilled, centerPosition, createExplosiveThrowable, createThrowable, generate, placePlayerInCenter } from "./telekeneticMapHelper";
import { SHAPES } from "../../../Maps/coverGenerator";
import * as MapHelper from '../../../Maps/helper';
import * as Helper from '../../../../helper';
import * as EnemyActors from '../Actors/Enemies';
import Mission from "../../../Mission/Mission";
import SpatterEmitter from "../../../Engine/Particle/Emitters/spatterEmitter";

export default function GenerateOfficeMap (mode) {
  // refreshColors({fg: COLORS.light})
  // refreshColors({fg: COLORS.blue_dark})
  refreshColors({fg: COLORS.light_mid})
  addInnerMostTileTypeFilled(mode, 'FREE_FALL', 0)
  addInnerMostTileTypeFilled(mode, 'WALL', 5)
  addInnerMostTileTypeFilled(mode, 'GROUND', 6)
  mode.game.initializeMapTiles();

  const CENTER_POSITION = centerPosition(mode);
  // chance of center cubicles (hash shape)
  if (Helper.getXChance(0.12)) generate(mode, { x: CENTER_POSITION.x - 3, y: CENTER_POSITION.y - 4 }, SHAPES.smallHash, ACTOR_PARAMS.cubicle_wall)
  // chance of West walls cubicles
  if (Helper.getXChance(0.75)) {
    for (let y = 7; y < 18; y += 3) {
      generate(mode, { x: 5, y }, SHAPES.horizontalLine3, ACTOR_PARAMS.cubicle_wall)
    }
  }
  // // chance of East walls cubicles
  if (Helper.getXChance(0.5)) {
    for (let y = 7; y < 18; y += 3) {
      generate(mode, { x: 25, y }, SHAPES.horizontalLine3, ACTOR_PARAMS.cubicle_wall)
    }
  }
  // // chance of south walls cubicles
  if (Helper.getXChance(0.5)) {
    generate(mode, { x: 9, y: 16 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
    generate(mode, { x: 12, y: 16 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
    generate(mode, { x: 20, y: 16 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
    generate(mode, { x: 23, y: 16 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
  }

  // // chance of north walls cubicles
  if (Helper.getXChance(0.5)) {
    generate(mode, { x: 9, y: 5 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
    generate(mode, { x: 12, y: 5 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
    generate(mode, { x: 20, y: 5 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
    generate(mode, { x: 23, y: 5 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
  }

  // chance of windows on outer walls
  // replace WALL tilte with GROUND tile, then place window_wall actor on top
  // each wall has random window layout: no windows, 2 equidistant windows, or 4 equidistant windows or fully windowed (GROUND tile with window_wall actor on top)
  for (let x = 5; x < 25; x++) {
    // north wall windows
    if (Helper.getXChance(0.5)) {
      if ([16, 17, 18, 19].includes(x)) continue; // skip elevator doors
      MapHelper.addTileToMap({map: mode.game.map, key: `${x},5`, tileKey: mode.tileKey, tileType: 'GROUND'})
      generate(mode, { x, y: 5 }, SHAPES.point, ACTOR_PARAMS.window_wall)
    }
    // south wall windows
    if (Helper.getXChance(0.5)) {
      MapHelper.addTileToMap({map: mode.game.map, key: `${x},20`, tileKey: mode.tileKey, tileType: 'GROUND'})
      generate(mode, { x, y: 20 }, SHAPES.point, ACTOR_PARAMS.window_wall)
    }
  }

  for (let y = 7; y < 18; y++) {
    // west wall windows
    if (Helper.getXChance(0.5)) {
      MapHelper.addTileToMap({map: mode.game.map, key: `5,${y}`, tileKey: mode.tileKey, tileType: 'GROUND'})
      generate(mode, { x: 5, y }, SHAPES.point, ACTOR_PARAMS.window_wall)
    }
    // east wall windows
    if (Helper.getXChance(0.5)) {
      MapHelper.addTileToMap({map: mode.game.map, key: `29,${y}`, tileKey: mode.tileKey, tileType: 'GROUND'})
      generate(mode, { x: 29, y }, SHAPES.point, ACTOR_PARAMS.window_wall)
    }
  }

  // place items
  const numberOfItems = Helper.getRandomIntInclusive(10, 40)
  Helper.getNumberOfItemsInArray(numberOfItems, MapHelper.getEmptyGroundTileKeys(mode.game)).forEach((key) => {
    const pos = Helper.stringToCoords(key)
    const params = Helper.getRandomInArray([
      ACTOR_PARAMS.bottle,
      ACTOR_PARAMS.scissors,
      ACTOR_PARAMS.stapler,
      ACTOR_PARAMS.mug,
      ACTOR_PARAMS.pencil,
      ACTOR_PARAMS.phone,
    ])
    generate(mode, pos, SHAPES.point, params, createThrowable)
  })

  const numberOfExplosiveItems = Helper.getRandomIntInclusive(1, 3)
  Helper.getNumberOfItemsInArray(numberOfExplosiveItems, MapHelper.getEmptyGroundTileKeys(mode.game)).forEach((key) => {
    const pos = Helper.stringToCoords(key)
    generate(mode, pos, SHAPES.point, ACTOR_PARAMS.fire_extinguisher, createExplosiveThrowable)
  })

  mode.placeThrowables()

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
  const firstWaveCount = Helper.getRandomIntInclusive(1, 2)
  const secondWaveCount = Helper.getRandomIntInclusive(2, 3)
  const thirdWaveCount = Helper.getRandomIntInclusive(3, 4)

  mode.initializeMissionManager({
    missions: [
      new Mission({
        name: 'First Wave',
        description: 'These office spacers are just as determined to keep you here as the scientists. Eliminate them.',
        timesToComplete: firstWaveCount,
        eventToComplete: `security guard:destroy`,
        onTrigger: () => {
          Helper.range(firstWaveCount).forEach((index) => {
            const randomPosition = Helper.getRandomInArray(MapHelper.getEmptyGroundTileKeys(mode.game))
            const pos = Helper.stringToCoords(randomPosition)
            
            EnemyActors.addsecurityGuard(mode, pos)
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
        description: 'More office spacers, back from lunch break. Eliminate them.',
        timesToComplete: secondWaveCount,
        eventToComplete: `security guard:destroy`,
        onTrigger: () => {
          Helper.range(secondWaveCount).forEach((index) => {
            const randomPosition = Helper.getRandomInArray(MapHelper.getEmptyGroundTileKeys(mode.game))
            const pos = Helper.stringToCoords(randomPosition)
            
            EnemyActors.addsecurityGuard(mode, pos)
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
        description: 'More office spacers, back from ... Ahh, eliminate them.',
        timesToComplete: thirdWaveCount,
        eventToComplete: `security guard:destroy`,
        onTrigger: () => {
          Helper.range(thirdWaveCount).forEach((index) => {
            const randomPosition = Helper.getRandomInArray(MapHelper.getEmptyGroundTileKeys(mode.game))
            const pos = Helper.stringToCoords(randomPosition)
            
            EnemyActors.addsecurityGuard(mode, pos)
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
    ],
  })
}
