const EntityLog = () => {
  let entities = []
  return {
    add: (entity) => entities.push(entity),
    remove: (entity) => entities = entities.filter((ent) => ent.id !== entity.id),
    getAllEntities: () => entities,
  }
}

export default EntityLog
