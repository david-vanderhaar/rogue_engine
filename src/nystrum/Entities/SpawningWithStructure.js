import * as Constant from '../constants';
import * as Helper from '../../helper';

export const SpawningWithStructure = superclass => class extends superclass {
  constructor({ 
    spawnStructure = Constant.CLONE_PATTERNS.clover,
    spawnPoints = null,
    spawnedEntityClass,
    spawnedEntityOptions = null,
    getSpawnedEntityOptions = null, 
    forceSpawn = true,
    ...args 
  }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('SPAWNING_WITH_STRUCTURE');
    this.spawnStructure = spawnStructure;
    this.spawnPoints = spawnPoints;
    this.spawnedEntityClass = spawnedEntityClass;
    this.spawnedEntityOptions = spawnedEntityOptions;
    this.getSpawnedEntityOptions = getSpawnedEntityOptions;
    this.forceSpawn = forceSpawn;
  }

  getPointsToSpawn() {
    if (this.spawnPoints) return this.spawnPoints
    return Helper.getPositionsFromStructure(this.spawnStructure, this.getPosition())
  }

  createEntitiesToSpawn() {
    return this.getPointsToSpawn().map((position, index) => {
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
      if (this.forceSpawn || this.game.canOccupyPosition(entity.pos, entity)){
        if(this.game.placeActorOnMap(entity)) {
          if (entity.entityTypes.includes('ACTING')) this.game.engine.addActor(entity);
          entity.direction = this.direction // hack, abstract in onAfterSpawnEntity
        }
      }
    })
  }
};
