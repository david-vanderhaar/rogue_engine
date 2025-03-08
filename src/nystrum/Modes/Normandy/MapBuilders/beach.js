import * as ROT from 'rot-js';
import * as Helper from '../../../../helper';
import * as MapHelper from '../../../Maps/helper';
import * as CoverGenerator from '../../../Maps/coverGenerator';
import { Foxhole } from '../Items/Environment/Foxhole';
// import * as Constant from '../../../constants';
// import * as Item from '../../../items';
// import { generate as generateBuilding } from '../../../Maps/generator';
// import { Debris, Bandit, RangedBandit, FireSpread, JacintoAI } from '../../../Entities/index';

export function beach(mode) {
  createEmptySand(mode);
  generateFoxholes(mode, 10);
  generateCoverBlocks(mode, 30);
  generateShoreline(mode);
  placeEnemies(mode);
  createPlayerSafeZone(mode);
  mode.placePlayersInSafeZone();
} // END

function placeEnemies(mode) {
  let groundTiles = Object.keys(mode.game.map).filter((key) => mode.game.map[key].type === 'GROUND_SAND');
  mode.data.enemies.forEach((enemyName) => {
    let pos = Helper.getRandomInArray(groundTiles);
    let posXY = pos.split(',').map((coord) => parseInt(coord));
    mode[`add${enemyName}`]({ x: posXY[0], y: posXY[1] });
  });
}

function createPlayerSafeZone(mode) {
  // create boat
  MapHelper.addTileZone(
    mode.game.tileKey,
    { x: 14, y: mode.game.mapHeight - 7 },
    7,
    3,
    'SAFE',
    mode.game.map,
    mode.game.mapHeight,
    mode.game.mapWidth
  );

  // create safe zone boat walls
  MapHelper.addTileZoneRectUnfilled(
    mode.game.tileKey,
    { x: 14, y: mode.game.mapHeight - 7 },
    7,
    3,
    'WALL',
    mode.game.map,
  );

  // leave opening for player to enter
  MapHelper.addTileToMap({ map: mode.game.map, key: `15,${mode.game.mapHeight - 7}`, tileKey: mode.tileKey, tileType: 'SAFE' });
}

function generateShoreline(mode) {
  // add DEEP_WATER to the bottom 4 rows
  for (let i = mode.game.mapHeight - 4; i < mode.game.mapHeight; i++) {
    for (let j = 0; j < mode.game.mapWidth; j++) {
      const key = `${j},${i}`;
      let type = 'DEEP_WATER';
      MapHelper.addTileToMap({ map: mode.game.map, key, tileKey: mode.tileKey, tileType: type });
    }
  }

  for (let i = mode.game.mapHeight - 5; i < mode.game.mapHeight - 4; i++) {
    for (let j = 0; j < mode.game.mapWidth; j++) {
      const key = `${j},${i}`;
      let type = 'DEEP_WATER';
      if (Math.random() > 0.65) {
        MapHelper.addTileToMap({ map: mode.game.map, key, tileKey: mode.tileKey, tileType: type });
      }
    }
  }

  // add a natural-looking edge of WATER starting where the DEEP_WATER ends
  for (let i = mode.game.mapHeight - 6; i < mode.game.mapHeight - 2; i++) {
    for (let j = 0; j < mode.game.mapWidth; j++) {
      const key = `${j},${i}`;
      let type = 'WATER';
      // randomly skip some tiles to make it look more natural
      if (Math.random() > 0.45) {
        MapHelper.addTileToMap({ map: mode.game.map, key, tileKey: mode.tileKey, tileType: type });
      }
    }
  }
}

function generateCoverBlocks(mode, number) {
  const edgeTiles = MapHelper.getPositionsInTileZone(
    mode.game.mapHeight,
    mode.game.mapWidth,
    { x: 3, y: 3 },
    mode.game.mapHeight - 6,
    mode.game.mapWidth - 6,
  );

  for (let i = 0; i < number; i++) {
    let pos = Helper.getRandomInArray(edgeTiles);
    generateCoverBlock(mode, pos)
  }
}

function generateCoverBlock(mode, pos) {
  CoverGenerator.generateRandom(pos, mode.game, CoverGenerator.generateBeachCoverBlock);
}


function createEmptySand(mode) {
  const digger = new ROT.Map.Cellular(mode.game.mapWidth, mode.game.mapHeight);
  digger.randomize(0.6) // the higher this percentage, the hight the difficulty due to more tall grass
  Helper.range(4).forEach(() => digger.create())
  let freeCells = [];
  let digCallback = function (x, y, value) {      
    let key = x + "," + y;
    // let type = Helper.getRandomInArray(['GROUND_SAND', 'GROUND_SAND_ALT'])
    let type = 'GROUND_SAND'
    if (value) { 
      type = 'GROUND_SAND_ALT';
    }
    MapHelper.addTileToMap({map: mode.game.map, key, tileKey: mode.game.tileKey, tileType: type})
    freeCells.push(key);
  }
  digger.create(digCallback.bind(this));
  digger.connect(digCallback.bind(this))
}

function generateFoxholes(mode, number) {
  for (let i = 0; i < number; i++) {
    generateFoxhole(mode);
    // generateFoxhole_v1(mode);
  }
}

function generateFoxhole(mode) {
  const pos = Helper.getRandomPos(mode.game.map).coordinates
  Foxhole(
    pos,
    mode.game,
    Helper.getRandomInt(1, 3),
  );
}
