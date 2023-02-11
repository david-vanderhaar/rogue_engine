import React from "react"

export default ({game}) => {
  return (
    <div className="UI" style={{marginBottom: 20}}>
      {
        game.entityLog.getAllUniqueEntities().map(
          (entity, index) => <Card key={index} entity={entity} />
        )
      }
    </div>
  )
}

const Card = ({entity}) => {
  return (
    <div>
      <div style={{
        color: entity.renderer.color
      }}>
        <span style={{
          backgroundColor: entity.renderer.background,
          borderRadius: 2,
          padding: 2,
          marginRight: 5,
        }}>
          {entity.renderer.sprite || entity.renderer.character}
        </span>
        {entity.name}
      </div>
      <div>
        {entity.getFullDescription()}
      </div>
    </div>
  )
}
