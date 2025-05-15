import React from 'react';
import { CARTRIDGE } from '../Nystrum';
import { SCREENS } from './constants';

export default function Splash(props) {
    return (
      <div className="Title">
        <div className="Title__content">
          <h2 style={{color: CARTRIDGE.theme.accent, marginBottom: 70}}>Splash Screen</h2>
          <button
            className='btn btn-main btn-themed'
            onClick={() => {
              props.setActiveScreen(SCREENS.TITLE)
            }}
          >
            It's my ninja way!
          </button>
        </div>
      </div>
    );
}
