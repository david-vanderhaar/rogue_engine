import React, { useEffect } from 'react';
import { SCREENS } from '../../../Modes/HiddenLeaf/Screen/constants';

function getTournament (props) {
  return props.meta?.tournament || createTournament(props)
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
  // const {opponents, player, active} = getTournament(props)
  const tournament = getTournament(props)

  useEffect(() => {
    props.setMeta({tournament})
  }, []);

  return (
    <div className="Title">
      <div
        className="Title__content"
        style={{
          width: '100vw',
          padding: 50,
        }}
      >
        <h1>Tournament</h1>
        <Lineup active={tournament.active}>
          {
            tournament.opponents.map((character, index) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <OpponentCard 
                    key={index}
                    character={character.basicInfo}
                    animated={index === tournament.active}
                  />
                  {(index === tournament.active) && (
                    <div>
                      <h2>VS</h2>
                      <div style={{padding: 8, marginLeft: 50, marginRight: 50}}>
                        <PlayerCard character={tournament.player.basicInfo} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          }
        </Lineup>
        <button
          className='btn btn-main btn-themed'
          style={{marginTop: 100}}
          onClick={() => props.setActiveScreen(SCREENS.LEVEL)}
        >
          Let's Go!
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

function OpponentCard({character, animated}) {
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
