import React, { useEffect } from 'react';
import { SCREENS } from '../../../Modes/HiddenLeaf/Screen/constants';

function getTournament (props) {
  return props.meta()?.tournament || createTournament(props)
}

function createTournament ({characters, selectedCharacter: player}) {
  // filter characters that match the player's name
  const opponents = characters.filter((character) => character.name !== player.name)
  const shuffledOpponents = shuffle(opponents)

  return {
    opponents: shuffledOpponents,
    player: player,
    active: 0,
  }
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function Tournament(props) {
  const tournament = getTournament(props)

  useEffect(() => {
    // set the meta data in a global state
    props.meta({tournament})
  }, []);

  function gotToLevel () {
    props.setActiveScreen(SCREENS.LEVEL)
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        gotToLevel()
      }
    };
    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);
    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="Title">
      <div
        className="Title__content"
        style={{
          width: '100vw',
          padding: 50,
          paddingTop: 0,
        }}
      >
        <h1>Tournament</h1>
        <Lineup active={tournament.active}>
          {
            tournament.opponents.map((character, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {(index === tournament.active) && (
                    <div>
                      <div style={{padding: 8, marginLeft: 50, marginRight: 50}}>
                        <PlayerCard character={tournament.player.basicInfo} />
                      </div>
                      <h2>VS</h2>
                    </div>
                  )}
                  <OpponentCard 
                    character={character.basicInfo}
                    animated={index === tournament.active}
                  />
                </div>
              )
            })
          }
        </Lineup>
        <button
          className='btn btn-main btn-themed'
          style={{marginTop: 100}}
          onClick={gotToLevel}
        >
          Press Enter to start
        </button>
      </div>
    </div>
  );
}

// a lineup of components with a active index
function Lineup({active, children}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
        {
          children.map((child, index) => {
            // if index is less than active, render the child with opacity 0.5 and grayscale
            // if index is greater than active, render the child with opacity 0.5
            let style = {opacity: 1}
            if (index < active) {
              style = {
                opacity: 0.9,
                filter: 'grayscale(100%)',
              }
            } else if (index > active) {
              style = {
                opacity: 0.6,
              }
            }

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                  ...style,
                }}
              >
                {child}
              </div>
            )
          })
        }
      </div>
  )
    
}

export function OpponentCard({character, animated}) {
  return (
    <div
      className={`opponent-card ${animated ? 'animated-border' : '' }`}
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
        '--character-background-color': character.renderer.background,
        '--character-color': character.renderer.color,
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
        border: '5px solid ',
        borderRadius: 5,
        borderColor: character.renderer.background,
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
