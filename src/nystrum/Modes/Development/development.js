import { Mode } from '../default';
import * as CONSTANT from '../../constants';
import * as JACINTO_CONSTANT from '../Jacinto/theme'
import * as LocustActors from '../Jacinto/Actors/Grubs';
import * as Helper from '../../../helper'

export class Development extends Mode {
  constructor({ ...args }) {
    super({ ...args });
    this.game.tileKey = {
      ...CONSTANT.TILE_KEY,
      ...JACINTO_CONSTANT.TILE_KEY
    }
  }

  initialize() {
    super.initialize();
    this.game.createEmptyLevel();
    this.game.initializeMapTiles();
    this.game.placePlayerRandomly()
    
    Helper.range(10).forEach((index) =>
      LocustActors.addWretch(this, Helper.getRandomPos(this.game.map).coordinates))
  }

  update() {}
}