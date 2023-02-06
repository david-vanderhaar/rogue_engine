import React from "react"

export default ({game}) => {
  return (
    <div className="UI">
      <div>Visible Entities</div>
      {
        game.entityLog.getAllEntities().map((entity, index) => <Card key={index} entity={entity} />)
      }
    </div>
  )
}

const Card = ({entity}) => {
  return (
    <div>
      <div>{entity.name}</div>
    </div>
  )
}
