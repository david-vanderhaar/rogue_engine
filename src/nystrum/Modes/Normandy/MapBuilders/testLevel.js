import * as Helper from '../../../../helper';
import * as MapHelper from '../../../Maps/helper';
import * as CoverGenerator from '../../../Maps/coverGenerator';
// import * as Constant from '../../../constants';
// import * as Item from '../../../items';
// import { generate as generateBuilding } from '../../../Maps/generator';
// import { Debris, Bandit, RangedBandit, FireSpread, JacintoAI } from '../../../Entities/index';

export function testLevelBuilder(mode) {
  // create empty level
  for (let i = 0; i < mode.game.mapHeight; i ++) {
    for (let j = 0; j < mode.game.mapWidth; j ++) {
      const key = `${j},${i}`
      let type = 'GROUND_ALT';
      MapHelper.addTileToMap({map: mode.game.map, key, tileKey: mode.tileKey, tileType: type})
    }
  }

  // add a random number of blobs of random size of GROUND
  // using addTileZone
  for (let i = 0; i < 20; i++) {
    let size = Helper.getRandomInt(4, 12);
    let x = Helper.getRandomInt(0, mode.game.mapWidth);
    let y = Helper.getRandomInt(0, mode.game.mapHeight);
    MapHelper.addTileZone(
      mode.game.tileKey,
      { x, y },
      size,
      size,
      'GROUND',
      mode.game.map,
      mode.game.mapHeight,
      mode.game.mapWidth,
    );
  }

  // add a random number of blobs of random size of WATER
  // using addTileZone
  for (let i = 0; i < 3; i++) {
    let size = Helper.getRandomInt(2, 6);
    let x = Helper.getRandomInt(0, mode.game.mapWidth);
    let y = Helper.getRandomInt(0, mode.game.mapHeight);
    MapHelper.addTileZoneFilledCircle(
      { x, y },
      size,
      'WATER',
    );
  }

  // outer walls
  MapHelper.addTileZoneRectUnfilled(
    mode.game.tileKey,
    { x: 0, y: 0 },
    mode.game.mapHeight,
    mode.game.mapWidth,
    'WALL',
    mode.game.map,
  );
  
  // inner walls
  MapHelper.addTileZoneRectUnfilled(
    mode.game.tileKey,
    { x: 1, y: 1 },
    mode.game.mapHeight - 2,
    mode.game.mapWidth - 2,
    'WALL',
    mode.game.map,
  );

  // place player start zone
  MapHelper.addTileZone(
    mode.game.tileKey,
    { x: 31, y: 9 },
    4,
    4,
    'SAFE',
    mode.game.map,
    mode.game.mapHeight,
    mode.game.mapWidth,
  );
  mode.placePlayersInSafeZone();

  // place enemies
  let groundTiles = Object.keys(mode.game.map).filter((key) => mode.game.map[key].type === 'GROUND')
  mode.data.enemies.forEach((enemyName) => {
    let pos = Helper.getRandomInArray(groundTiles);
    let posXY = pos.split(',').map((coord) => parseInt(coord));
    mode[`add${enemyName}`]({ x: posXY[0], y: posXY[1] });
  })

  const edgeTiles = MapHelper.getPositionsInTileZone(
    mode.game.mapHeight,
    mode.game.mapWidth,
    { x: 3, y: 3 },
    mode.game.mapHeight - 6,
    mode.game.mapWidth - 6,
  )

  for (let i = 0; i < 10; i++) {
    let posXY = Helper.getRandomInArray(edgeTiles);
    CoverGenerator.generateTree(posXY, mode.game);
  }
}
