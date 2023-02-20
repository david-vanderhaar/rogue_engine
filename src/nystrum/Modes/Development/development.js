import { Mode } from '../default';
import * as CONSTANT from '../../constants';
import * as JACINTO_CONSTANT from '../Jacinto/theme'

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
  }

  update() {}
}