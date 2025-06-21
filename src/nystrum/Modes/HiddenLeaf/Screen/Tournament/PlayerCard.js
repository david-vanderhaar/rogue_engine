import React from 'react';

export function PlayerCard({character}) {
  return (
    <div
      className='player-card'
      style={{
        border: '5px solid ',
        borderRadius: 5,
        borderColor: character.renderer.background,
      }}
    >
      <img
        src={character.portrait}
        alt={character.name}
        style={{
          width: '342px',
        }}
      />
      <div
        className='player-card__name'
        style={{
          color: character.renderer.color,
          backgroundColor: character.renderer.background,
        }}
      >
        {character.name}
      </div>
    </div>
  )
}
