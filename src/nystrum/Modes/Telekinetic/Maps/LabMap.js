import { DirectionalProjectile, MovingWall } from "../../../Entities";
import { abstractGenerate, generateCoverBlock, SHAPES } from "../../../Maps/coverGenerator";
import { COLORS, refreshColors } from "../theme";
import * as Helper from '../../../../helper';


export default function GenerateLabMap (mode) {
  // COLORS.fg_override = COLORS.light
  // refreshColors({fg: COLORS.light})
  mode.createEmptyLevel();
  mode.game.initializeMapTiles();
  mode.addWalls();

  const CENTER_POSITION = centerPosition(mode);

  // place operating table in center
  generate(mode, {x: CENTER_POSITION.x - 1, y: CENTER_POSITION.y - 1}, SHAPES.horizontalLine, FURNITURE_PARAMS.operating_table)
  // place player in center
  placePlayerInCenter(mode);
  // place table near center
  generate(mode, { x: CENTER_POSITION.x + 3, y: CENTER_POSITION.y }, SHAPES.southWestVerticalL, FURNITURE_PARAMS.table)
  generate(mode, { x: CENTER_POSITION.x - 2, y: CENTER_POSITION.y }, SHAPES.southEastVerticalL, FURNITURE_PARAMS.table)
  // place medical equipment around room
  // place 3 dead scientists around room (with blood stains)  
  // place elevator doors on right side

  mode.addEnemies(1, 'addRandom')
  mode.placeThrowables(6)
}

function placePlayerInCenter(mode) {
  const player = mode.getPlayer();
  player.move(centerPosition(mode));
}

function centerPosition (mode) {
  return  { x: Math.floor(mode.game.mapWidth / 2), y: Math.floor(mode.game.mapHeight / 2) }
}

function createFurniture (mode, pos, {range, character, name, color, background, passable = false}) {
  // const piece = new DirectionalProjectile({
  const piece = new MovingWall({
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
    speed: range * 100,
    energy: 0,
    range,
    damageToSelf: 1,
    remainAfterUse: true,
  })

  mode.game.placeActorOnMap(piece)
}

export const generate = (mode, pos, shape, params, createFunction = createFurniture) => {
  const positions = Helper.getPositionsFromStructure(shape, pos);
  positions.forEach((position) => {
    let tile = mode.game.map[Helper.coordsToString(position)];
    if (!tile) return false;
    createFunction(mode, position, params);
  });
}


const FURNITURE_PARAMS = {
  operating_table: { range: 5, character: '#', name: 'operating table', color: COLORS.light, background: COLORS.dark_accent, passable: true },
  table: { range: 2, character: 'T', name: 'table', color: COLORS.light, background: COLORS.dark },
}
