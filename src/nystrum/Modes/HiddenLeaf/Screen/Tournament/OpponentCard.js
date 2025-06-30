import React from 'react';

export function OpponentCard({character, animated}) {
  return (
    <div
      className={`opponent-card ${animated ? 'animated-border' : '' } fadeIn`}
      style={{
        border: '3px solid ',
        borderRadius: 5,
        borderColor: character.renderer.color,
        margin: 5,
        '--character-background-color': character.renderer.background,
        '--character-color': character.renderer.color,
      }}
    >
      <img
        src={character.portrait}
        alt={character.name}
        style={{
          width: '140px',
        }}
      />
      <div
        className='opponent-card__name'
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
