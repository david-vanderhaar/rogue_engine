import uuid from 'uuid/v1';
import { destroyEntity } from './helper';
import { cloneDeep } from 'lodash';

export const Cloning = superclass => class extends superclass {
  constructor({ cloneLimit = 1, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('CLONING');
    this.cloneLimit = cloneLimit;
    this.clones = [];
  }
  // perhaps clones should have a status effect that leeches parent actor's energy or chakra
  // status effects should be removed from engine when owner is removed.
  destroy() {
    // add function to override self destroy funtion 
    // if this actor dies, clones should be destroyed as well
    if (this.clones) {
      this.clones.map((clone) => {
        destroyEntity(clone);
      });
    }
    destroyEntity(this);
  }
  destroyClone(id) {
    // overrides clone destroy function
    // when clone is destroyed, clone count will change accordingly
    const index = this.clones.findIndex((c) => c.id === id);
    if (index >= 0) {
      this.clones[index].super__destroy();
      this.clones.splice(index, 1);
    }
  }
  createClone(cloneArgs) {
    if (this.clones.length < this.cloneLimit) {
      let clone = cloneDeep(this);
      clone.name = `Clone`;
      clone.game = this.game;
      clone.id = uuid();
      delete clone.clones;
      clone['super__destroy'] = clone.destroy;
      clone.destroy = () => { this.destroyClone(clone.id); };
      cloneArgs.forEach((arg) => {
        clone[arg.attribute] = arg.value;
      });
      if (this.game.placeActorOnMap(clone)) {
        this.game.engine.addActorAsNext(clone);
        this.game.draw();
        this.clones.push(clone);
        return true;
      }
      ;
    }
    return false;
  }
};
