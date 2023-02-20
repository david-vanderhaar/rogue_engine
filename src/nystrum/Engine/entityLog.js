const EntityLog = () => {
  let entities = []
  let lookedAt = []
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
    },
    setLookedAt: (targets = []) => lookedAt = targets,
    getLookedAt: () => lookedAt,
  }
}

export default EntityLog
