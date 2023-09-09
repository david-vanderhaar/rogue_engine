import * as Helper from '../../helper';

export const destroyEntity = (entity) => {
  if (entity.pos) {
    let tile = entity.game.map[Helper.coordsToString(entity.pos)];
    if (tile) {
      tile.entities = tile.entities.filter((e) => e.id !== entity.id);
    }
  }
  entity.game.engine.removeStatusEffectByActorId(entity.id);
  entity.game.draw()
  
  entity.game.engine.actors = entity.game.engine.actors.filter((e) => e.id !== entity.id);
  entity.game.entityLog.remove(entity)
}

export function destroyActor(entity) {
  entity.energy = 0;
  entity.active = false;
  destroyEntity(entity)
}