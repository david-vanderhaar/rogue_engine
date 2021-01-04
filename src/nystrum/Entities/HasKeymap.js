import * as _ from 'lodash';

export const HasKeymap = superclass => class extends superclass {
  constructor({ ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('HAS_KEYMAP');
    this.keymapStack = [];
  }

  getKeymap () {
    return _.get(this.keymapStack, '0', null);
  }

  addKeymap (newKeymap) {
    this.keymapStack.unshift(newKeymap);
  }

  removeKeymap () {
    this.keymapStack.shift();
  }

  setKeymap (newKeymap) {
    this.addKeymap(newKeymap);
    return this.getKeymap;
  }

  goToPreviousKeymap () {
    this.removeKeymap();
    return this.getKeymap();
  }
};
