import React from 'react';
import { SCREENS } from '../Modes/HiddenLeaf/Screen/constants';
import Tooltip from './Tooltip';
import { ProgressBar } from './Entity/CharacterCard';

const CharacterCardSelect = (props) => {
  const characters = props.characters
  return (
    // grid of character cards at least 4 wide
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      {
        characters.map((character, index) => {
          return (
            <CharacterCard 
              key={index}
              character={character} 
              setSelectedCharacter={props.setSelectedCharacter} 
              setActiveScreen={props.setActiveScreen} 
            />
          )
        })
      }
    </div>
  );
}

const CharacterCard = ({character, setActiveScreen, setSelectedCharacter}) => {
  const actor = character.basicInfo

  return (
    <button
      className='hidden-leaf-character-card'
      style={{
        '--hover-background-color': character.basicInfo.renderer.background,
        '--hover-color': character.basicInfo.renderer.color,
      }}
      onClick={() => {
        setSelectedCharacter(character)
        setActiveScreen(SCREENS.TOURNAMENT)
      }}
    >
      {/* a small, bordered character portrait */}
      <div>
        <img
          src={actor.portrait}
          alt={actor.name}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </div>
      {/* the character's name */}
      <div>
        {actor.name}
      </div>
      {/* the character's description */}
      <div>
        {actor.description}
      </div>
      <div style={{display: 'flex', marginTop: 10}}> {/* bottom half of card  */}
      <div>
          {/* stats */}
          <div style={{textAlign: 'left',}}>
            <b style={{minWidth: 70, marginRight: 5}}>Speed</b>
            <ProgressBar 
                attributePath='speedRating'
                attributeValueMax={3}
                colorFilled='#ff9926'
                unit={100}
                actor={actor} 
              />
          </div>
          <div style={{textAlign: 'left',}}>
            <b style={{minWidth: 70, marginRight: 5}}>Defense</b>
            <ProgressBar 
              attributePath='durabilityRating'
              attributeValueMax={3}
              colorFilled='#dc322f'
              unit={1}
              actor={actor} 
            />
          </div>
          <div style={{textAlign: 'left',}}>
            <b style={{minWidth: 70, marginRight: 5}}>Chakra</b>
            <ProgressBar 
              attributePath='chakraRating'
              attributeValueMax={3}
              colorFilled='#3e7dc9'
              unit={1}
              actor={actor} 
            />
          </div>
        </div>        
        <div style={{flex: 1, textAlign: 'left'}}>
          {/* summary of charactet's special abilities */}
          <div><b>Jutsus</b></div>
          {actor.abilities.map((ability, index) => {
            return (
              <Tooltip 
                key={index}
                title={ability.name}
                text={ability.description}
              >
                <div style={{border: '1px solid', borderRadius: 5, padding: 5, marginRight: 10, marginBottom: 10}}>
                  {ability.name}
                </div>
              </Tooltip>
            )
          })}
        </div>
      </div>
    </button>
  )
}

export default CharacterCardSelect;