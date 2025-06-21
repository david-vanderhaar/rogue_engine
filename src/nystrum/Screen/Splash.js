import React, { useEffect } from 'react';
import { CARTRIDGE } from '../Nystrum';
import { SCREENS } from './constants';
import { SOUNDS } from '../Modes/HiddenLeaf/sounds';
import { delay } from '../../helper';

export default function Splash(props) {
  function playButtonSound () {
    SOUNDS.lose_theme.play();
  }

  async function nextScreen () {
    playButtonSound()
    // await delay(2500)
    props.setActiveScreen(SCREENS.TITLE)
  }

  useEffect(() => {
    // Add event listener when the component mounts
    window.addEventListener('click', nextScreen);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('click', nextScreen);
    };
  }, []);

  return (
    <div className="Title" style={{height: 720, width: 1280, backgroundColor: 'var(--color-console-background)'}}>
      <div className="Title__content">
        <img
          src={window.PUBLIC_URL + '/mean_mug_logo.png'}
          alt="mean mug logo"
          style={{top: 96}}
          className="Splash--logo"
        />
        <div
          className='btn btn-main btn-themed-outline Splash__button'
          style={{top: 600, position: 'relative'}}
          onClick={nextScreen}
        >
          click to start
        </div>
      </div>
    </div>
  );
}
