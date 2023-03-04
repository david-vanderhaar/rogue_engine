import * as ROT from 'rot-js';
import { Mode } from '../default';
import * as CONSTANT from '../../constants';
import * as TALL_GRASS_CONSTANT from '../TallGrass/theme'
import * as MonsterActors from '../TallGrass/Actors/Monsters';
import * as Helper from '../../../helper'
import * as MapHelper from '../../Maps/helper';

export class SomethingInTheTallGrass extends Mode {
  constructor({ ...args }) {
    super({ ...args });
    this.game.tileKey = {
      ...CONSTANT.TILE_KEY,
      ...TALL_GRASS_CONSTANT.TILE_KEY,
    }

    this.game.fovActive = true
  }

  initialize() {
    super.initialize();
    this.game.createEmptyLevel();
    this.generateLevel()
    this.game.initializeMapTiles();
    this.game.placePlayerRandomly()
    
    Helper.range(1).forEach((index) =>
      MonsterActors.addWretch(this, Helper.getRandomPos(this.game.map).coordinates))
  }

  generateLevel_v1() {
    const x = Math.floor(this.game.mapWidth / 2)
    MapHelper.addTileZone(
      this.game.tileKey,
      { x, y: 0 },
      this.game.mapHeight,
      10,
      'GROUND_ALT',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
  }

  generateLevel () {
    const digger = new ROT.Map.Cellular(this.game.mapWidth, this.game.mapHeight);
    digger.randomize(0.6)
    Helper.range(4).forEach(() => digger.create())
    let freeCells = [];
    let digCallback = function (x, y, value) {      
      let key = x + "," + y;
      let type = 'GROUND';
      if (value) { 
        type = 'TALL_GRASS';
        // type = 'WATER';
      }
      MapHelper.addTileToMap({map: this.game.map, key, tileKey: this.game.tileKey, tileType: type})
      freeCells.push(key);
    }
    digger.create(digCallback.bind(this));
    digger.connect(digCallback.bind(this))
  }

  update() {}
}