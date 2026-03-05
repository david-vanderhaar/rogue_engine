import { SHAPES } from "../../../Maps/coverGenerator";
import * as MapHelper from '../../../Maps/helper';
import { COLORS, refreshColors } from "../theme";
import * as Helper from '../../../../helper';
import Mission from "../../../Mission/Mission";
import * as EnemyActors from '../Actors/Enemies';
import SpatterEmitter from "../../../Engine/Particle/Emitters/spatterEmitter";
import { ACTOR_PARAMS, centerPosition, createThrowable, generate, placePlayerInCenter } from "./telekeneticMapHelper";

export default function GenerateLabMap (mode) {
  refreshColors({fg: COLORS.dark_accent})
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
