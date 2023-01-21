import React from 'react';
import { CARTRIDGE } from '../Nystrum';
import { SCREENS } from '../Screen/constants';

const ModeSelect = (props) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: CARTRIDGE.theme.main,
        backgroundImage: `url("${CARTRIDGE.coverImage}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundPositionY: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {
        props.modes.map((mode, index) => {
          let color = '';
          if (props.selectedMode) {
            color = props.selectedMode.name === mode.name ? 'red' : ''
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
                props.setSelectedMode(mode)
                props.setActiveScreen(SCREENS.CHARACTER_SELECT)
              }}
            >
              {mode.name}
            </button>
          )
        })
      }
    </div>
  );
}

export default ModeSelect;