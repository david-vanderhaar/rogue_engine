import React, { useEffect } from 'react';
import { SOUNDS } from '../sounds'
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Screen/constants';
import { fadeMusicInOut } from './useEffects/fadeMusicInOut';

function Title(props) {
  const playButtonSound = () => {
    SOUNDS.wood_button.play();
  }

  function nextScreen () {
    props.setActiveScreen(SCREENS.CHARACTER_SELECT)
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
        <h2 className="Title__heading" style={{color: CARTRIDGE.theme.accent, zIndex: 100}}>The Chunin Exams</h2>
        <img
          src={window.PUBLIC_URL + '/hidden_leaf/title/rock_lee.png'}
          alt="Rock Lee"
          style={{left: -130, top: 30}}
          className="Title__character Title__character--left"
        />
        <img
          src={window.PUBLIC_URL + '/hidden_leaf/title/gaara.png'}
          alt="Gaara"
          style={{right: -134, bottom: 40}}
          className="Title__character Title__character--right"
        />
        <img
          src={window.PUBLIC_URL + '/hidden_leaf/title/exclaim_0.png'}
          alt="Exclaim 0"
          style={{left: 446, top: 96}}
          className="fadeInPartial__image"
        />
        <img
          src={window.PUBLIC_URL + '/hidden_leaf/title/exclaim_1.png'}
          alt="Exclaim 1"
          style={{left: 854, top: 100}}
          className="fadeInPartial__image"
        />
        <img
          src={window.PUBLIC_URL + '/hidden_leaf/title/exclaim_2.png'}
          alt="Exclaim 2"
          style={{left: 150, bottom: 250}}
          className="fadeInPartial__image"
        />
        <img
          src={window.PUBLIC_URL + '/hidden_leaf/title/exclaim_3.png'}
          alt="Exclaim 3"
          style={{left: 200, bottom: 200}}
          className="fadeInPartial__image"
        />
        <img
          src={window.PUBLIC_URL + '/hidden_leaf/title/exclaim_4.png'}
          alt="Exclaim 4"
          style={{left: 854, top: 250}}
          className="fadeInPartial__image"
        />
        <img
          src={window.PUBLIC_URL + '/hidden_leaf/title/exclaim_5.png'}
          alt="Exclaim 5"
          style={{right: 266, bottom: 62}}
          className="fadeInPartial__image"
        />
        <img
          src={window.PUBLIC_URL + '/hidden_leaf/title/exclaim_5.png'}
          alt="Exclaim 5"
          style={{left: 400, top: 144}}
          className="fadeInPartial__image"
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