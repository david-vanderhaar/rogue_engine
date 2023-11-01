import React from 'react';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Modes/HiddenLeaf/Screen/constants';

export default function Tournament(props) {
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
