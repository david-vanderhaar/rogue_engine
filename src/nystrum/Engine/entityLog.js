const EntityLog = () => {
  let entities = []
  return {
    add: (entity) => entities.push(entity),
    remove: (entity) => entities = entities.filter((ent) => ent.id !== entity.id),
    getAllEntities: () => entities,
    getAllUniqueEntities: () => {
      const unique = []
      entities.forEach((entity) => {
        if (!unique.find((item) => item.name === entity.name)) unique.push(entity)
      })

      return unique
    }
  }
}

export default EntityLog
