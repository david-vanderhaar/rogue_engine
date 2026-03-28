import React, { useEffect } from 'react';
import { SOUNDS } from '../sounds'
import { CARTRIDGE } from '../../../Nystrum';
import { fadeMusicInOut } from './useEffects/fadeMusicInOut';
import { SCREENS } from './constants';
import SoundManager from '../../../Sounds/SoundManager';

function Title(props) {
  const playButtonSound = () => {
    SoundManager.getSound('ui_button').play()
  }

  function nextScreen () {
    props.setActiveScreen(SCREENS.INTRO_MOVIE)
    playButtonSound()
  }

  useEffect(fadeMusicInOut(SOUNDS.title_theme), [])
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
    <div className="Title" style={{height: 720, width: 1280, position: 'relative', overflow: 'visible'}}>
      <div className="Title__content" style={{height: '100%', width: '100%', position: 'relative', overflow: 'visible', maxHeight: 720, maxWidth: 1280}}>
        <h2 className="Title__heading" style={{color: CARTRIDGE.theme.accent, zIndex: 100}}>Telekinetic!</h2>
        <img
          src={window.PUBLIC_URL + '/telekinetic/title/hands_front.png'}
          alt="two hands"
          style={{left: -350, top: -5}}
          className="Title__character Title__character--left"
        />
        <img
          src={window.PUBLIC_URL + '/telekinetic/title/eye.png'}
          alt="eye"
          style={{right: -190, bottom: -360}}
          className="Title__character Title__character--right"
        />
        <img
          src={window.PUBLIC_URL + '/telekinetic/title/face.png'}
          alt="face"
          style={{left: -136, top: -500}}
          className="fadeInFull__image"
        />
        <img
          src={window.PUBLIC_URL + '/telekinetic/title/hands_down.png'}
          alt="hands"
          style={{left: 595, top: -478}}
          className="fadeInFull__image"
        />
        <button
          className="btn btn-main btn-themed Title__button"
          onClick={nextScreen}
        >
          New Game
        </button>
        <span className="Title__hint">press enter to start</span>
      </div>
    </div>
  );
}

export default Title;