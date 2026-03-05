import { COLORS, refreshColors } from "../theme";
import { ACTOR_PARAMS, addInnerMostTileTypeFilled, centerPosition, generate, placePlayerInCenter } from "./telekeneticMapHelper";
import { SHAPES } from "../../../Maps/coverGenerator";
import * as MapHelper from '../../../Maps/helper';
import * as Helper from '../../../../helper';
import * as EnemyActors from '../Actors/Enemies';

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
  if (Helper.getXChance(1)) generate(mode, { x: CENTER_POSITION.x - 3, y: CENTER_POSITION.y - 4 }, SHAPES.smallHash, ACTOR_PARAMS.cubicle_wall)
  // chance of West walls cubicles
  if (Helper.getXChance(1)) {
    for (let y = 7; y < 18; y += 3) {
      generate(mode, { x: 5, y }, SHAPES.horizontalLine3, ACTOR_PARAMS.cubicle_wall)
    }
  }
  // // chance of East walls cubicles
  if (Helper.getXChance(1)) {
    for (let y = 7; y < 18; y += 3) {
      generate(mode, { x: 25, y }, SHAPES.horizontalLine3, ACTOR_PARAMS.cubicle_wall)
    }
  }
  // // chance of south walls cubicles
  if (Helper.getXChance(1)) {
    generate(mode, { x: 9, y: 16 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
    generate(mode, { x: 12, y: 16 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
    generate(mode, { x: 20, y: 16 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
    generate(mode, { x: 23, y: 16 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
  }

  // // chance of north walls cubicles
  if (Helper.getXChance(1)) {
    generate(mode, { x: 9, y: 5 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
    generate(mode, { x: 12, y: 5 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
    generate(mode, { x: 20, y: 5 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
    generate(mode, { x: 23, y: 5 }, SHAPES.verticalLine3, ACTOR_PARAMS.cubicle_wall)
  }


  mode.addEnemies(1, 'addRandom')
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

  mode.startMissionManager()
}
