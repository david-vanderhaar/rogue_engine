import React from 'react';
import { CARTRIDGE } from '../Nystrum';
import { SCREENS } from '../Screen/constants';

const CharacterSelect = (props) => {
  return (
    <div className='CharacterSelect'>
      {
        props.characters.map((character, index) => {
          let color = '';
          if (props.selectedCharacter) {
            color = props.selectedCharacter.name === character.name ? 'red' : ''
          }

          return (
            <button
              key={index}
              style={{
                backgroundColor: CARTRIDGE.theme.accent,
                color: CARTRIDGE.theme.main,
              }}
              className={`CharacterSelect__button btn btn-main`}
              onClick={() => {
                props.setSelectedCharacter(character)
                props.setActiveScreen(SCREENS.LEVEL)
              }}
            >
              Play as {character.name}
            </button>
          )
        })
      }
    </div>
  );
}

export default CharacterSelect;