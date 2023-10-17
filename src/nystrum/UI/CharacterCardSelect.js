import React from 'react';
import { CARTRIDGE } from '../Nystrum';
import { SCREENS } from '../Screen/constants';

const CharacterCardSelect = (props) => {
  return (
    <div style={
      {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }>
      {
        props.characters.map((character, index) => {
          const actor = character.basicInfo

          return (
            <button
              key={index}
              style={{
                backgroundColor: CARTRIDGE.theme.accent,
                color: CARTRIDGE.theme.main,
                margin: '1rem',
                padding: '1rem',
                maxHeight: '20rem',
                width: '20rem',
                cursor: 'pointer',
                borderRadius: '5px',
                border: 'none',
              }}
              onClick={() => {
                props.setSelectedCharacter(character)
                props.setActiveScreen(SCREENS.LEVEL)
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
            </button>
          )
        })
      }
    </div>
  );
}

export default CharacterCardSelect;