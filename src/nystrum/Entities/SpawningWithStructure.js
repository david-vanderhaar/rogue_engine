import * as Constant from '../constants';
import * as Helper from '../../helper';

export const SpawningWithStructure = superclass => class extends superclass {
  constructor({ spawnStructure = Constant.CLONE_PATTERNS.clover, spawnedEntityClass, spawnedEntityOptions = null, getSpawnedEntityOptions = null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('SPAWNING_WITH_STRUCTURE');
    this.spawnStructure = spawnStructure;
    this.spawnedEntityClass = spawnedEntityClass;
    this.spawnedEntityOptions = spawnedEntityOptions;
    this.getSpawnedEntityOptions = getSpawnedEntityOptions;
  }

  createEntitiesToSpawn() {
    return Helper.getPositionsFromStructure(this.spawnStructure, this.getPosition()).map((position, index) => {
      const options = this.spawnedEntityOptions || this.getSpawnedEntityOptions()
      return new this.spawnedEntityClass({
        ...options,
        pos: {...position},
        game: this.game,
        name: `${options.name} ${index}`,
      })
    })
  }

  spawnEntities() {
    const entities = this.createEntitiesToSpawn();
    entities.forEach((entity) => {
      if(this.game.placeActorOnMap(entity)) {
        if (entity.entityTypes.includes('ACTING')) this.game.engine.addActor(entity);
        entity.direction = this.direction // hack, abstract in onAfterSpawnEntity
      }
    })
  }
};
