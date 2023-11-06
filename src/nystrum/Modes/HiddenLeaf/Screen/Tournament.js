import React from 'react';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Modes/HiddenLeaf/Screen/constants';
import { Player } from '../../../Entities';

export default function Tournament(props) {
  const characters = props.characters.map((character) => character.basicInfo)
  const player = props.selectedCharacter.basicInfo
  return (
    <div className="Title">
      <div
        className="Title__content"
        style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: CARTRIDGE.theme.main,
        }}
      >
        <h1>Tournament</h1>
        <PlayerCard character={player} />
        <OpponentLineup characters={characters} />
        <button
          className='btn btn-main btn-themed'
          onClick={() => props.setActiveScreen(SCREENS.LEVEL)}
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
}

function OpponentLineup({characters, player}) {
  return (
    <div
      className='opponent-lineup'
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {
        characters.map((character, index) => {
          return (
            <OpponentCard 
              key={index}
              character={character} 
            />
          )
        })
      }
    </div>
  )
}

function OpponentCard({character}) {
  return (
    <div
      className='opponent-card'
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // width: '100%',
        border: '3px solid ',
        borderRadius: 5,
        borderColor: character.renderer.color,
        padding: 5,
        margin: 5,
      }}
    >
      <img
        src={character.portrait}
        alt={character.name}
        style={{
          height: '100%',
          width: '100%',
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

function PlayerCard({character}) {
  return (
    <div
      className='player-card'
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        border: '3px solid ',
        borderRadius: 5,
        borderColor: character.renderer.color,
      }}
    >
      <img
        src={character.portrait}
        alt={character.name}
        style={{
          height: '100%',
          width: '100%',
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
