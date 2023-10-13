import React from 'react';
import { CARTRIDGE } from '../Nystrum';
import { SCREENS } from '../Screen/constants';
import { Portrait, NamePlate, ProgressBar } from '../UI/Entity/CharacterCard';

const CharacterCardSelect = (props) => {
  return (
    <div className='CharacterSelect'>
      {
        props.characters.map((character, index) => {
          const actor = character.basicInfo
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
                height: 'fit-content',
              }}
              className={`CharacterSelect__button btn btn-main`}
              onClick={() => {
                props.setSelectedCharacter(character)
                props.setActiveScreen(SCREENS.LEVEL)
              }}
            >
              <div className='CharacterCard'>
                <div>
                  <NamePlate actor={actor} />
                  <Portrait actor={actor} />
                  <ProgressBar
                    label='Action'
                    attributePath='energy'
                    attributePathMax='speed'
                    colorFilled='#ff9926'
                    unit={100}
                    actor={actor}
                  />
                  <ProgressBar
                    label='Health'
                    attributePath='durability'
                    attributePathMax='durabilityMax'
                    colorFilled='#dc322f'
                    unit={1}
                    actor={actor}
                  />
                  <ProgressBar
                    label='Chakra'
                    attributePath='charge'
                    attributePathMax='chargeMax'
                    colorFilled='#13b8d7'
                    unit={1}
                    actor={actor}
                  />
                </div>
              </div>
            </button>
          )
        })
      }
    </div>
  );
}

export default CharacterCardSelect;