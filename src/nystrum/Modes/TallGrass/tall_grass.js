import { Mode } from '../default';
import * as CONSTANT from '../../constants';
import * as TALL_GRASS_CONSTANT from '../TallGrass/theme'
import * as MonsterActors from '../TallGrass/Actors/Monsters';
import * as Helper from '../../../helper'

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
    this.game.initializeMapTiles();
    this.game.placePlayerRandomly()
    
    Helper.range(1).forEach((index) =>
      MonsterActors.addWretch(this, Helper.getRandomPos(this.game.map).coordinates))
  }

  update() {}
}