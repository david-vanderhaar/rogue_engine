import * as Helper from '../../../../helper';
import * as MapHelper from '../../../Maps/helper';
import * as CoverGenerator from '../../../Maps/coverGenerator';
// import * as Constant from '../../../constants';
// import * as Item from '../../../items';
// import { generate as generateBuilding } from '../../../Maps/generator';
// import { Debris, Bandit, RangedBandit, FireSpread, JacintoAI } from '../../../Entities/index';

export function beach(mode) {
  // create empty level
  for (let i = 0; i < mode.game.mapHeight; i ++) {
    for (let j = 0; j < mode.game.mapWidth; j ++) {
      const key = `${j},${i}`
      let type = 'GROUND_SAND_ALT';
      MapHelper.addTileToMap({map: mode.game.map, key, tileKey: mode.tileKey, tileType: type})
    }
  }

  // add a random number of blobs of random size of GROUND
  // using addTileZone
  for (let i = 0; i < 200; i++) {
    let size = Helper.getRandomInt(1, 4);
    let x = Helper.getRandomInt(0, mode.game.mapWidth);
    let y = Helper.getRandomInt(0, mode.game.mapHeight);
    MapHelper.addTileZone(
      mode.game.tileKey,
      { x, y },
      size,
      size,
      'GROUND_SAND',
      mode.game.map,
      mode.game.mapHeight,
      mode.game.mapWidth,
    );
  }

  // add DEEP_WATER to the bottom 4 rows
  for (let i = mode.game.mapHeight - 4; i < mode.game.mapHeight; i++) {
    for (let j = 0; j < mode.game.mapWidth; j++) {
      const key = `${j},${i}`
      let type = 'DEEP_WATER';
      MapHelper.addTileToMap({map: mode.game.map, key, tileKey: mode.tileKey, tileType: type})
    }
  }
  
  for (let i = mode.game.mapHeight - 5; i < mode.game.mapHeight - 4; i++) {
    for (let j = 0; j < mode.game.mapWidth; j++) {
      const key = `${j},${i}`
      let type = 'DEEP_WATER';
      if (Math.random() > 0.65) {
        MapHelper.addTileToMap({map: mode.game.map, key, tileKey: mode.tileKey, tileType: type})
      }
    }
  }

  // add a natural-looking edge of WATER starting where the DEEP_WATER ends
  for (let i = mode.game.mapHeight - 6; i < mode.game.mapHeight - 2; i++) {
    for (let j = 0; j < mode.game.mapWidth; j++) {
      const key = `${j},${i}`
      let type = 'WATER';
      // randomly skip some tiles to make it look more natural
      if (Math.random() > 0.45) {
        MapHelper.addTileToMap({map: mode.game.map, key, tileKey: mode.tileKey, tileType: type})
      }
    }
  }

  // place player start zone
  MapHelper.addTileZone(
    mode.game.tileKey,
    { x: 14, y: mode.game.mapHeight - 7 },
    7,
    3,
    'SAFE',
    mode.game.map,
    mode.game.mapHeight,
    mode.game.mapWidth,
  );
  mode.placePlayersInSafeZone();

  // place enemies
  let groundTiles = Object.keys(mode.game.map).filter((key) => mode.game.map[key].type === 'GROUND_SAND');
  mode.data.enemies.forEach((enemyName) => {
    let pos = Helper.getRandomInArray(groundTiles);
    let posXY = pos.split(',').map((coord) => parseInt(coord));
    mode[`add${enemyName}`]({ x: posXY[0], y: posXY[1] });
  })

  // const edgeTiles = MapHelper.getPositionsInTileZone(
  //   mode.game.mapHeight,
  //   mode.game.mapWidth,
  //   { x: 3, y: 3 },
  //   mode.game.mapHeight - 6,
  //   mode.game.mapWidth - 6,
  // )

  // for (let i = 0; i < 10; i++) {
  //   let posXY = Helper.getRandomInArray(edgeTiles);
  //   CoverGenerator.generateTree(posXY, mode.game);
  // }
}
