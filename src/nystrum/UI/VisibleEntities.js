import React from "react"

export const VisibleEntities = ({game}) => {
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

export const LookedAtEntites = ({game}) => {
  const lookedAt = game.entityLog.getLookedAt()
  if (lookedAt.length <= 0) return null

  return (
    <div className='Popup' style={{top: 0, position: 'absolute', textAlign: 'left', zIndex: 1, maxWidth: '60%'}}>
      {lookedAt.map((entity, index) => <Card key={index} entity={entity} />)}
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
