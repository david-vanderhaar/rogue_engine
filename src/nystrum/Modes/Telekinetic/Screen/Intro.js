import React, { useEffect } from 'react';
import { SOUNDS } from '../sounds'
import { CARTRIDGE } from '../../../Nystrum';
import { fadeMusicInOut } from './useEffects/fadeMusicInOut';
import { SCREENS } from './constants';
import HelpContent from '../UI/HelpContent';

function Intro(props) {
  const playButtonSound = () => {
    SOUNDS.wood_button.play();
  }

  function nextScreen () {
    const character = props.characters.at(0)
    
    props.setSelectedCharacter(character);
    props.meta({
      tournament: {player: character, currentRound: 1},
      turnsTaken: 0,
      enemiesDefeated: 0,
    });
    
    playButtonSound()
    props.setActiveScreen(SCREENS.LEVEL)
  }

  // useEffect(fadeMusicInOut(SOUNDS.title_theme), [])
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
        <h2 className="Title__heading" style={{color: CARTRIDGE.theme.accent, zIndex: 100}}>Intro!</h2>
        <HelpContent />
        <button
          className="btn btn-main btn-themed Title__button"
          onClick={nextScreen}
        >
          Skip
        </button>
        <span className="Title__hint">press enter to skip</span>
      </div>
    </div>
  );
}

export default Intro;