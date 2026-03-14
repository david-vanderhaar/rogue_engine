import { SHAPES } from "../../../Maps/coverGenerator";
import * as MapHelper from '../../../Maps/helper';
import { COLORS, refreshColors } from "../theme";
import * as Helper from '../../../../helper';
import Mission from "../../../Mission/Mission";
import * as EnemyActors from '../Actors/Enemies';
import SpatterEmitter from "../../../Engine/Particle/Emitters/spatterEmitter";
import { ACTOR_PARAMS, centerPosition, createThrowable, generate, placePlayerInCenter } from "./telekeneticMapHelper";

export default function GenerateLabMap (mode) {
  refreshColors({fg: COLORS.blue_light_dark})
  mode.createEmptyLevel();
  mode.game.initializeMapTiles();
  mode.addWalls(6);

  const CENTER_POSITION = centerPosition(mode);

  // place operating table in center
  generate(mode, {x: CENTER_POSITION.x - 1, y: CENTER_POSITION.y - 2}, SHAPES.horizontalLine, ACTOR_PARAMS.operating_table)
  // place player in center
  placePlayerInCenter(mode);
  // place table near center
  generate(mode, { x: CENTER_POSITION.x + 5, y: CENTER_POSITION.y + 1 }, SHAPES.southWestVerticalL, ACTOR_PARAMS.table)
  generate(mode, { x: CENTER_POSITION.x - 4, y: CENTER_POSITION.y + 1 }, SHAPES.southEastVerticalL, ACTOR_PARAMS.table)
  generate(mode, { x: CENTER_POSITION.x - 4, y: CENTER_POSITION.y - 2 }, SHAPES.northEastVerticalL, ACTOR_PARAMS.table)
  generate(mode, { x: CENTER_POSITION.x + 5, y: CENTER_POSITION.y - 2}, SHAPES.northWestVerticalL, ACTOR_PARAMS.table)
  // place medical equipment around room
  Helper.getNumberOfItemsInArray(16, MapHelper.getEmptyGroundTileKeys(mode.game)).forEach((key) => {
    const pos = Helper.stringToCoords(key)
    const params = Helper.getRandomInArray([ACTOR_PARAMS.scissors, ACTOR_PARAMS.scalpel])
    // const params = Helper.getRandomInArray([ACTOR_PARAMS.bottle, ACTOR_PARAMS.scalpel, ACTOR_PARAMS.scissors, ACTOR_PARAMS.pliers])
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
  // EnemyActors.addByKey(mode, {x: 17, y: 6}, 'office_2')
  startMissionManager(mode);
}

function startMissionManager(mode) {
  const player = mode.game.getFirstPlayer();
  // const opp = mode.getFirstEnemyActor();


  const firstMission = new Mission({
    name: 'Throwing Practice',
    description: 'Your body is too weak to fight, but your mind is sharp. \nPress "f" to activate telekinesis, select an object within range, then select a direction.',
    timesToComplete: 2,
    eventToComplete: `${player?.id}:apply_status_effect_thrown`,
  })

  const secondMission = new Mission({
    name: 'More Throwing Practice',
    description: 'Some objects break when thrown, heavier objects, like furniture, can be thrown multiple times. Try throwing a table.',
    timesToComplete: 2,
    eventToComplete: `${player?.id}:apply_status_effect_thrown:table`,
  })

  const thirdMission = new Mission({
    name: 'First Blood',
    description: 'A guard must have heard you. Use your telekinesis to attack them. Throw a scalpel or pair of scissors at them to cause damage from range.',
    timesToComplete: 2,
    eventToComplete: `lab rat:destroy`,
    
    onTrigger: () => {
      EnemyActors.addByKey(mode, { x: 17, y: 6 }, 'lab_rat')
      EnemyActors.addByKey(mode, { x: 18, y: 6 }, 'lab_rat')
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

  const fall = new Mission({
    name: 'Don\'t Fall',
    description: 'Your fighting created a few holes in the floor. Proceed to a dark spaced tile, where the floor fell away. See what happens.',
    timesToComplete: 1,
    eventToComplete: `${player?.id}:move:tileType:FREE_FALL`,
    onTrigger: () => {
      // get random pos, away from player
      // generate a few holes
      MapHelper.addTileToMap({map: mode.game.map, key: `17,9`, tileKey: mode.tileKey, tileType: 'FREE_FALL'})
      MapHelper.addTileToMap({map: mode.game.map, key: `18,9`, tileKey: mode.tileKey, tileType: 'FREE_FALL'})
      MapHelper.addTileToMap({map: mode.game.map, key: `19,9`, tileKey: mode.tileKey, tileType: 'FREE_FALL'})
    }
  })

  const panic = new Mission({
    name: 'Don\'t Panic',
    description: 'You have a few turns before you fall to your death. Go ahead and climb back out of there.',
    timesToComplete: 1,
    eventToComplete: `${player?.id}:move:tileType:GROUND`,
  })

  const fourthMission = new Mission({
    name: 'Escape the Lab',
    description: 'Proceed to the elevator at the top, center spaces and escape this place.',
    timesToComplete: 1,
    eventToComplete: `${player?.id}:move:tileType:ELEVATOR`,
  })
  
  const skipTutorial = new Mission({
    name: 'Skip the Tutorial',
    description: 'Proceed to the elevator at the top, center spaces to skip this tutorial.',
    timesToComplete: 1,
    eventToComplete: `${player?.id}:move:tileType:ELEVATOR`,
    active: true,
    dependantMissions: [
      firstMission,
      secondMission,
      thirdMission,
      fall,
      panic,
      fourthMission,
    ]
  })

  mode.initializeMissionManager({
    missions: [
      firstMission,
      secondMission,
      thirdMission,
      fall,
      panic,
      fourthMission,
      skipTutorial,
    ],
  })
}
