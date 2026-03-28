import React, { useEffect } from 'react';
import { CARTRIDGE } from '../Nystrum';
import { SCREENS } from './constants';
import SoundManager from '../Sounds/SoundManager';


export default function Splash(props) {
  function playThemeSound () {
    SoundManager.createSoundFromSource('/sounds/mean_mug_theme.mp3', {volume: 0.4}).play()
  }

  function playButtonSound () {
    SoundManager.getSound('ui_button').play()
  }
  
  async function nextScreen () {
    playButtonSound()
    props.setActiveScreen(SCREENS.TITLE)
  }

  useEffect(() => {
    playThemeSound()
    // Add event listener when the component mounts
    window.addEventListener('click', nextScreen);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('click', nextScreen);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        nextScreen()
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
