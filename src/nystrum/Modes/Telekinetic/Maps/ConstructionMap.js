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

export default function GenerateConstructionMap (mode) {
  refreshColors({fg: COLORS.blue_dark})
  addInnerMostTileTypeFilled(mode, 'FREE_FALL', 0)
  addInnerMostTileTypeFilled(mode, 'WALL', 5)
  addInnerMostTileTypeFilled(mode, 'GROUND', 6)
  mode.game.initializeMapTiles();

  generateHoles(mode, {x: 6, y: 6}, 23, 14)

  const CENTER_POSITION = centerPosition(mode);
  // ranomd pars of outer wall missing
  // random windows on outer wall
  // drywall walls in random Ls and lines
  // drones can spawn in and move in from FREE_FALL areas
  // random water puddles, player can walk on at cost of mind, enemies cannot

  // place construnction items (more damage)
  // const numberOfItems = Helper.getRandomIntInclusive(10, 40)
  // Helper.getNumberOfItemsInArray(numberOfItems, MapHelper.getEmptyGroundTileKeys(mode.game)).forEach((key) => {
  //   const pos = Helper.stringToCoords(key)
  //   const params = Helper.getRandomInArray([
  //     ACTOR_PARAMS.bottle,
  //     ACTOR_PARAMS.scissors,
  //     ACTOR_PARAMS.stapler,
  //     ACTOR_PARAMS.mug,
  //     ACTOR_PARAMS.pencil,
  //     ACTOR_PARAMS.phone,
  //   ])
  //   generate(mode, pos, SHAPES.point, params, createThrowable)
  // })

  // const numberOfExplosiveItems = Helper.getRandomIntInclusive(1, 3)
  // Helper.getNumberOfItemsInArray(numberOfExplosiveItems, MapHelper.getEmptyGroundTileKeys(mode.game)).forEach((key) => {
  //   const pos = Helper.stringToCoords(key)
  //   generate(mode, pos, SHAPES.point, ACTOR_PARAMS.fire_extinguisher, createExplosiveThrowable)
  // })

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

function generateHoles (mode, offset, width = 24, height = 16) {
  const digger = new ROT.Map.Cellular(width, height);
  digger.randomize(0.4) // the higher this percentage, the hight the difficulty due to more tall grass
  let freeCells = [];
  let digCallback = function (x, y, value) {      
    let key = `${x + offset.x},${y + offset.y}`
    // let type = Helper.getRandomInArray(['BURNT', 'BURNT'])
    let type = 'GROUND'
    if (value) type = 'FREE_FALL';
    MapHelper.addTileToMap({map: mode.game.map, key, tileKey: mode.game.tileKey, tileType: type})
    freeCells.push(key);
  }
  digger.create(digCallback.bind(this));
  digger.connect(digCallback.bind(this))
}

function startMissionManager(mode) {
  const player = mode.game.getFirstPlayer();
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
      new Mission({
        name: 'Escape the Building',
        description: 'Proceed to the elevator and escape this place.',
        timesToComplete: 1,
        eventToComplete: `${player?.id}:move:tileType:ELEVATOR`,
      }),
    ],
  })
}
