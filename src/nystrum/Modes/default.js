import uuid from 'uuid/v1';
import {merge} from 'lodash';

export class Mode {
  constructor({
    game = null,
    data = {},
  }) {
    let id = uuid();
    this.id = id;
    this.game = game;
    this.data = data;
    this.infoBlocks = {}
  }

  initialize() {}

  update() {}

  updateInfoBlock(id, value) {
    merge(this.infoBlocks, {[id]: value})
  }

}